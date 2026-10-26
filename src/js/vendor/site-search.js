/*! site-search.js | lunr-backed search modal for the DataStax docs UI. It reuses the DocSearch v3
 * CSS class names (from @docsearch/css, MIT) so the existing DocSearch theme applies unchanged. */
/* global CustomEvent, performance */
;(function () {
  'use strict'

  var script = document.getElementById('site-search-script')
  if (!script || window.siteSearch) return
  var cfg = script.dataset
  var INDEX_URL = cfg.indexUrl
  var LUNR_URL = cfg.lunrUrl
  var CURRENT_COMPONENT = cfg.component || ''
  var SNIPPET_LENGTH = parseInt(cfg.snippetLength || '160', 10)
  var MAX_PAGES = 12 // distinct pages shown for a query
  var MAX_SECTIONS = 3 // matching sections shown under a page
  var RECENT_KEY = 'site-search:recent:' + siteRootKey()
  var RECENT_MAX = 6
  var PLATFORM = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || ''
  var IS_MAC = /(Mac|iPhone|iPod|iPad)/i.test(PLATFORM)

  function siteRootKey () {
    try {
      return new URL((cfg.siteRootPath || '.') + '/', window.location.href).pathname
    } catch (e) {
      return '/'
    }
  }

  // Icons are Lucide glyphs from the UI's icon font (lucide-static). The lines that join a page's
  // sections to it are drawn in CSS (site-search.css).
  var ICONS = {
    spinner: icon('loader-circle'),
    reset: icon('x'),
    page: icon('file-text'),
    section: icon('hash'),
    recent: icon('history'),
    select: icon('corner-down-left', 'DocSearch-Hit-Select-Icon'),
    tree: '<span class="DocSearch-Hit-Tree" aria-hidden="true"></span>',
    treeLast: '<span class="DocSearch-Hit-Tree DocSearch-Hit-Tree--last" aria-hidden="true"></span>',
    noResults: icon('search-x'),
    enter: icon('corner-down-left', '', 'Enter key'),
    down: icon('arrow-down', '', 'Arrow down'),
    up: icon('arrow-up', '', 'Arrow up'),
    remove: icon('x'),
  }

  // A Lucide icon, hidden from screen readers unless it has a label
  function icon (name, className, label) {
    var attrs = label ? ' role="img" aria-label="' + label + '"' : ' aria-hidden="true"'
    return '<i class="icon-' + name + (className ? ' ' + className : '') + '"' + attrs + '></i>'
  }

  // ---------------------------------------------------------------------------------------------
  // Index loading. Nothing is downloaded until the reader shows intent to search (hovering or
  // focusing the search button, pressing the shortcut, or opening the modal). search-index.js
  // calls window.antoraSearch.initSearch(lunr, data) when it has loaded.
  // ---------------------------------------------------------------------------------------------
  var engine = null // { lunr, index, store }
  var loading = null
  var settleLoading = null
  var initError = null
  var metrics = { indexRequestedAt: null, indexLoadedAt: null, indexParseMs: null, queries: [] }

  window.antoraSearch = {
    initSearch: function (lunr, data) {
      var t0 = performance.now()
      metrics.indexInitStartedAt = t0
      try {
        data = data || {}
        var store = data.store || {}
        if (store.separator) lunr.tokenizer.separator = new RegExp(store.separator)
        fixTokenSetKeys(lunr)
        // a site with nothing to index gets an empty file: search it as an empty index
        var index = data.index ? lunr.Index.load(derivePostings(data.index)) : emptyIndex(lunr)
        engine = {
          lunr: lunr,
          index: index,
          store: { documents: store.documents || {}, componentVersions: store.componentVersions || {} },
        }
      } catch (err) {
        initError = err
        if (window.console) console.error('Site search: the search index could not be loaded.', err)
        return
      }
      metrics.indexParseMs = performance.now() - t0
      metrics.indexLoadedAt = performance.now()
      if (settleLoading) settleLoading.resolve(engine)
    },
  }

  function emptyIndex (lunr) {
    return lunr(function () {
      this.ref('id')
      this.field('title')
    })
  }

  // lib/search-index-tuning.js (derive_postings) leaves out which pages each term occurs in,
  // because the field vectors already say which terms each page has. Put the postings back.
  function derivePostings (serialized) {
    if (serialized.postings !== 'derive-from-field-vectors') return serialized
    var noMetadata = {}
    var byTermIndex = []
    serialized.invertedIndex.forEach(function (entry) {
      var posting = entry[1]
      serialized.fields.forEach(function (field) {
        posting[field] = {}
      })
      byTermIndex[posting._index] = posting
    })
    serialized.fieldVectors.forEach(function (entry) {
      var fieldRef = entry[0]
      var slash = fieldRef.indexOf('/')
      var field = fieldRef.slice(0, slash)
      var docRef = fieldRef.slice(slash + 1)
      var elements = entry[1]
      for (var i = 0; i < elements.length; i += 2) byTermIndex[elements[i]][field][docRef] = noMetadata
    })
    return serialized
  }

  // lunr.Index.load compresses the index's word list into an automaton (TokenSet) by merging
  // states that have the same key. In Lunr 2.3.9 the key joins each edge's character and target
  // state id with nothing between them, so when words contain digits two different states can
  // share a key ('1' -> state 676, and '1' -> state 6 plus '7' -> state 6, both give 01676). The
  // merge then makes some indexed words unfindable (jvm17 in the full site) and accepts a few
  // words that aren't in the index, which makes a prefix or typo query that reaches one throw.
  // Ending each edge with a comma makes the keys unique. Runs before the first lunr.Index.load.
  function fixTokenSetKeys (lunr) {
    var proto = lunr.TokenSet.prototype
    if (proto.toString.hasEdgeDelimiters) return
    var toString = function () {
      if (this._str) return this._str
      var str = this.final ? '1' : '0'
      var labels = Object.keys(this.edges).sort()
      for (var i = 0; i < labels.length; i++) str += labels[i] + this.edges[labels[i]].id + ','
      return str
    }
    toString.hasEdgeDelimiters = true
    proto.toString = toString
  }

  // Scripts added with async = false download in parallel but run in the order they were added,
  // so lunr.js is defined by the time search-index.js runs.
  function loadScript (src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script')
      s.src = src
      s.async = false
      s.onload = resolve
      s.onerror = function () {
        s.remove()
        reject(new Error('Failed to load ' + src))
      }
      document.head.appendChild(s)
    })
  }

  function ensureIndex () {
    if (engine) return Promise.resolve(engine)
    if (loading) return loading
    metrics.indexRequestedAt = performance.now()
    initError = null
    var settle = {}
    var attempt = new Promise(function (resolve, reject) {
      settle.resolve = resolve
      settle.reject = reject
    })
    loading = attempt
    settleLoading = settle
    var fail = function (err) {
      if (loading === attempt) loading = null // allow a retry on the next attempt
      settle.reject(err)
    }
    // add lunr.js first: scripts added with async = false run in the order they were added
    var lunrLoaded = window.lunr ? null : loadScript(LUNR_URL)
    var indexLoaded = loadScript(INDEX_URL)
    Promise.all([lunrLoaded, indexLoaded]).then(function () {
      // the index script ran but didn't call initSearch, or initSearch failed
      if (!engine) fail(initError || new Error('The search index did not initialize'))
    }, fail)
    return attempt
  }

  // ---------------------------------------------------------------------------------------------
  // Searching and ranking
  // ---------------------------------------------------------------------------------------------
  function escapeRegExp (s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  function normalize (s) {
    return (s || '').toLowerCase().replace(/[^\w\s.]+/g, ' ').replace(/\s+/g, ' ').trim()
  }

  function queryTerms (query) {
    var lunr = engine.lunr
    var stopWords = lunr.stopWordFilter
    var pipeline = engine.index.pipeline
    var terms = []
    lunr.tokenizer(query).forEach(function (token) {
      var trimmed = lunr.trimmer(token)
      var raw = trimmed.toString()
      if (!raw || !stopWords(trimmed)) return // punctuation-only words and stop words
      var stem = pipeline.runString(raw)[0] || raw
      if (!terms.some(function (t) { return t.stem === stem })) terms.push({ raw: raw, stem: stem, prefixes: [] })
    })
    if (terms.length) {
      var last = terms[terms.length - 1]
      last.prefixes = typedPrefixTerms(last.raw, last.stem)
    }
    return terms
  }

  // The stem of a partly typed word is often not a prefix of the full word's stem (configurat is
  // not a prefix of configur, the stem of configuration), so a prefix search on it finds little.
  // When the stem isn't a word in the index, also match the index terms that the word typed so
  // far extends.
  function typedPrefixTerms (raw, stem) {
    if (stem in engine.index.invertedIndex) return []
    var found = []
    var min = Math.max(4, raw.length - 4)
    var node = engine.index.tokenSet
    for (var i = 0; i < raw.length && node; i++) {
      node = node.edges[raw[i]]
      if (node && node.final && i + 1 >= min) found.push(raw.slice(0, i + 1))
    }
    return found
  }

  function fuzzyDistance (t) {
    return t.raw.length >= 9 ? 2 : 1
  }

  function runLunr (terms, fuzzy) {
    var lunr = engine.lunr
    var last = terms.length - 1
    return engine.index.query(function (q) {
      terms.forEach(function (t, i) {
        q.term(t.stem, { usePipeline: false, boost: 10 })
        // the term being typed is matched as a prefix, like DocSearch's prefixLast
        if (i === last && t.raw.length >= 3) {
          q.term(t.stem, { usePipeline: false, wildcard: lunr.Query.wildcard.TRAILING, boost: 2 })
          t.prefixes.forEach(function (prefix) {
            if (prefix !== t.stem) q.term(prefix, { usePipeline: false, boost: 2 })
          })
        }
        if (fuzzy && t.raw.length >= 5) {
          q.term(t.stem, { usePipeline: false, editDistance: fuzzyDistance(t), boost: 1 })
        }
      })
    })
  }

  // Bounded edit distance that, like lunr's typo matching, counts swapping two adjacent letters
  // as one edit (optimal string alignment). Used only to credit typo matches in matchedTerms().
  function withinDistance (a, b, max) {
    if (Math.abs(a.length - b.length) > max) return false
    var d = []
    var i, j
    for (i = 0; i <= a.length; i++) d[i] = [i]
    for (j = 1; j <= b.length; j++) d[0][j] = j
    for (i = 1; i <= a.length; i++) {
      var rowMin = Infinity
      for (j = 1; j <= b.length; j++) {
        var v = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, d[i - 2][j - 2] + 1)
        d[i][j] = v
        if (v < rowMin) rowMin = v
      }
      if (rowMin > max) return false
    }
    return d[a.length][b.length] <= max
  }

  // Which query terms does a lunr result contain? A term counts when the result has its stem, a
  // completion or already-typed prefix of the last term, or (in the typo pass) a near miss of it.
  function matchedTerms (result, terms, fuzzy) {
    var keys = Object.keys(result.matchData.metadata)
    return terms.map(function (t, i) {
      var isLast = i === terms.length - 1
      return keys.some(function (m) {
        return (
          m === t.stem ||
          (isLast && (m.indexOf(t.stem) === 0 || t.prefixes.indexOf(m) >= 0)) ||
          (fuzzy && t.raw.length >= 5 && withinDistance(m, t.stem, fuzzyDistance(t)))
        )
      })
    })
  }

  function countTrue (flags) {
    return flags.reduce(function (n, f) {
      return f ? n + 1 : n
    }, 0)
  }

  function pagesWithAllWords (results, terms) {
    var byPage = {}
    results.forEach(function (r) {
      var id = r.ref.split('-')[0]
      var flags =
        byPage[id] ||
        (byPage[id] = terms.map(function () {
          return false
        }))
      matchedTerms(r, terms, false).forEach(function (m, i) {
        if (m) flags[i] = true
      })
    })
    return Object.keys(byPage).filter(function (id) {
      return byPage[id].every(Boolean)
    }).length
  }

  function hasPhrase (text, phrase) {
    return (' ' + text + ' ').indexOf(' ' + phrase + ' ') >= 0
  }

  // Each word in some form: its stem (vectorize → vector), minus a letter for endings the stemmer
  // leaves (strategi → strategy), or a typo-pass correction of it (reapir → repair)
  function termProbes (terms, corrections) {
    return terms.map(function (t, i) {
      var forms = [t.stem].concat((corrections && corrections[i]) || []).map(function (form) {
        return escapeRegExp(form.slice(0, Math.max(3, form.length - 1)))
      })
      return new RegExp('(^|[^\\w])(?:' + forms.join('|') + ')')
    })
  }

  // the words as typed (the last one may be a prefix), as opposed to any word with the same stem
  function wordProbes (terms) {
    return terms.map(function (t, i) {
      return new RegExp('(^|[^\\w])' + escapeRegExp(t.raw) + (i === terms.length - 1 ? '' : '(?!\\w)'))
    })
  }

  function textHasAll (text, probes) {
    var n = normalize(text)
    return probes.every(function (rx) {
      return rx.test(n)
    })
  }

  function headingTitle (heading) {
    return heading.title != null ? heading.title : heading.text
  }

  function findHeading (doc, id) {
    for (var i = 0; i < doc.titles.length; i++) {
      if (String(doc.titles[i].id) === id) return doc.titles[i]
    }
    return null
  }

  // The factor for how well a title or heading (normalized) matches the query: the whole query,
  // the query as a phrase, every query word as typed, or every query word in some form. boosts
  // holds the four factors in that order; any other title gets 1.
  function matchBoost (text, match, boosts) {
    if (text === match.query) return boosts[0]
    if (match.multiWord && hasPhrase(text, match.query)) return boosts[1]
    if (textHasAll(text, match.words)) return boosts[2]
    if (textHasAll(text, match.probes)) return boosts[3]
    return 1
  }

  // Ranking. Lunr's BM25 score is scaled by where the words matched, modeled on Algolia's
  // DocSearch ranking: a page title beats a section heading, which beats body text, and an exact
  // or phrase match beats words that are merely all present. Pages that contain every query word
  // hide pages that do not (unless none do), like Algolia's all-words-required default.
  // Site maintainers can override any of these by defining window.siteSearchRanking before this
  // script runs.
  var RANK = Object.assign(
    {
      titleExact: 6,
      titlePhrase: 5,
      titleAllWords: 4, // every query word, as typed
      titleAllStems: 3, // every query word, in some form (vectorize → vector)
      headingExact: 3.5,
      headingPhrase: 3.25,
      headingAllWords: 2.5,
      headingAllStems: 2,
      sectionWeight: 0.85, // a page's best section counts for this much of a title match
      currentComponent: 1.4, // results from the component the reader is in
      changelog: 0.4, // release notes and changelogs mention every feature; rank them lower
      changelogTitle: /release notes|changelog|upgrade guide|what.?s new/i,
      requireAllWords: true,
      typoPassBelow: 5, // also try typo-tolerant matching when fewer results than this
      minRelativeScore: 0, // hide pages scoring below this fraction of the best page
    },
    window.siteSearchRanking || {}
  )
  // the factors matchBoost() applies, strongest match first
  var TITLE_BOOSTS = [RANK.titleExact, RANK.titlePhrase, RANK.titleAllWords, RANK.titleAllStems]
  var HEADING_BOOSTS = [RANK.headingExact, RANK.headingPhrase, RANK.headingAllWords, RANK.headingAllStems]

  function search (query) {
    var started = performance.now()
    var terms = queryTerms(query)
    if (!terms.length) return { query: query, pages: [], terms: [] }
    var probes = termProbes(terms)
    var words = wordProbes(terms)
    var results = runLunr(terms, false)
    var usedFuzzy = false
    if (pagesWithAllWords(results, terms) < RANK.typoPassBelow) {
      var byRef = {}
      results.forEach(function (r) {
        byRef[r.ref] = r
      })
      runLunr(terms, true).forEach(function (r) {
        var found = byRef[r.ref]
        if (found) {
          // already matched exactly: keep its score, but credit the words the typo pass matched
          found.matchData.combine(r.matchData)
          found.fuzzy = true
        } else {
          r.score *= 0.5 // typo matches rank below exact matches
          r.fuzzy = true
          results.push(r)
        }
      })
      usedFuzzy = true
      // the index words the typo pass matched for each query word count as that word in titles
      // and headings too
      var corrections = terms.map(function () {
        return []
      })
      results.forEach(function (r) {
        if (!r.fuzzy) return
        Object.keys(r.matchData.metadata).forEach(function (m) {
          terms.forEach(function (t, i) {
            var list = corrections[i]
            if (m === t.stem || t.raw.length < 5 || list.length >= 8 || list.indexOf(m) >= 0) return
            if (withinDistance(m, t.stem, fuzzyDistance(t))) list.push(m)
          })
        })
      })
      probes = termProbes(terms, corrections)
    }
    var docs = engine.store.documents
    var nq = normalize(query)
    var match = { query: nq, multiWord: nq.indexOf(' ') > 0, words: words, probes: probes }
    var pages = {}
    results.forEach(function (r) {
      var parts = r.ref.split('-')
      var doc = docs[parts[0]]
      if (!doc) return
      var page = pages[parts[0]]
      if (!page) {
        page = pages[parts[0]] = {
          id: parts[0],
          doc: doc,
          score: 0,
          pageScore: 0,
          sections: [],
          textMatch: false,
          matched: terms.map(function () {
            return false
          }),
        }
      }
      var matched = matchedTerms(r, terms, r.fuzzy)
      matched.forEach(function (m, i) {
        if (m) page.matched[i] = true
      })
      var cov = countTrue(matched) / terms.length
      var score = r.score * cov * cov
      if (parts.length > 1) {
        var heading = findHeading(doc, parts[1])
        if (!heading) return
        score *= matchBoost(normalize(headingTitle(heading)), match, HEADING_BOOSTS)
        page.sections.push({ heading: heading, score: score })
      } else {
        score *= matchBoost(normalize(doc.title), match, TITLE_BOOSTS)
        page.pageScore = score
        page.textMatch = Object.keys(r.matchData.metadata).some(function (term) {
          return r.matchData.metadata[term].text
        })
      }
    })
    var list = Object.keys(pages).map(function (id) {
      var page = pages[id]
      page.sections.sort(function (a, b) {
        return b.score - a.score
      })
      var best = page.sections.length ? page.sections[0].score * RANK.sectionWeight : 0
      var score = Math.max(page.pageScore, best) + 0.1 * Math.min(page.pageScore, best)
      if (CURRENT_COMPONENT && page.doc.component === CURRENT_COMPONENT) score *= RANK.currentComponent
      if (RANK.changelogTitle.test(page.doc.title)) score *= RANK.changelog
      page.score = score
      page.coverage = countTrue(page.matched) / terms.length
      return page
    })
    if (RANK.requireAllWords) {
      // with four or more words, allow one to be missing
      var required = terms.length >= 4 ? (terms.length - 1) / terms.length : 1
      if (list.some(function (p) { return p.coverage >= required })) {
        list = list.filter(function (p) {
          return p.coverage >= required
        })
      }
    }
    list.sort(function (a, b) {
      return b.score - a.score
    })
    if (RANK.minRelativeScore && list.length) {
      var floor = list[0].score * RANK.minRelativeScore
      list = list.filter(function (p) {
        return p.score >= floor
      })
    }
    list = list.slice(0, MAX_PAGES)
    var typoWords = []
    if (usedFuzzy) {
      results.forEach(function (r) {
        if (!r.fuzzy) return
        Object.keys(r.matchData.metadata).forEach(function (m) {
          if (typoWords.indexOf(m) < 0 && terms.every(function (t) { return t.stem !== m })) typoWords.push(m)
        })
      })
    }
    var tookMs = performance.now() - started
    metrics.queries.push({ query: query, ms: tookMs, results: results.length, fuzzy: usedFuzzy })
    if (metrics.queries.length > 50) metrics.queries.shift()
    return {
      query: query,
      pages: list,
      terms: terms,
      typoWords: typoWords.slice(0, 20),
      tookMs: tookMs,
      total: Object.keys(pages).length,
    }
  }

  // ---------------------------------------------------------------------------------------------
  // Highlighting and snippets (built from text nodes; nothing from the index is parsed as HTML)
  // ---------------------------------------------------------------------------------------------
  // Words of three or more letters (and their stems) are highlighted with any ending, like lunr
  // matched them; shorter words only as whole words. Typo-pass matches are highlighted too.
  function termRegExp (terms, typoWords) {
    var prefixes = []
    var words = []
    var add = function (s) {
      if (!s) return
      var list = s.length >= 3 ? prefixes : words
      if (list.indexOf(s) < 0) list.push(s)
    }
    terms.forEach(function (t) {
      add(t.raw)
      add(t.stem)
      t.prefixes.forEach(add)
    })
    ;(typoWords || []).forEach(add)
    var byLength = function (a, b) {
      return b.length - a.length
    }
    prefixes.sort(byLength)
    words.sort(byLength)
    var alts = []
    if (prefixes.length) alts.push('(?:' + prefixes.map(escapeRegExp).join('|') + ')\\w*')
    if (words.length) alts.push('(?:' + words.map(escapeRegExp).join('|') + ')(?!\\w)')
    if (!alts.length) return null
    return new RegExp('(^|[^\\w])(' + alts.join('|') + ')', 'gi')
  }

  function appendHighlighted (el, text, rx) {
    if (!rx) {
      el.appendChild(document.createTextNode(text))
      return
    }
    var last = 0
    var m
    rx.lastIndex = 0
    while ((m = rx.exec(text))) {
      var start = m.index + m[1].length
      if (start > last) el.appendChild(document.createTextNode(text.slice(last, start)))
      var mark = document.createElement('mark')
      mark.textContent = m[2]
      el.appendChild(mark)
      last = start + m[2].length
      if (rx.lastIndex === m.index) rx.lastIndex++
    }
    if (last < text.length) el.appendChild(document.createTextNode(text.slice(last)))
  }

  function snippet (text, rx) {
    if (!text) return ''
    var at = 0
    if (rx) {
      rx.lastIndex = 0
      var m = rx.exec(text)
      if (m) at = m.index + m[1].length
    }
    var start = Math.max(0, at - Math.floor(SNIPPET_LENGTH / 3))
    if (start > 0) {
      var space = text.indexOf(' ', start)
      if (space > -1 && space < at) start = space + 1
    }
    var end = Math.min(text.length, start + SNIPPET_LENGTH)
    if (end < text.length) {
      var lastSpace = text.lastIndexOf(' ', end)
      if (lastSpace > at) end = lastSpace
    }
    return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '')
  }

  // ---------------------------------------------------------------------------------------------
  // Modal UI (markup mirrors DocSearch v3 so @docsearch/css and the site's overrides style it)
  // ---------------------------------------------------------------------------------------------
  var ui = null
  var lastFocus = null
  var activeIndex = -1
  var items = []
  var pendingTimer = null
  var lastRendered = null

  function el (tag, className, html) {
    var e = document.createElement(tag)
    if (className) e.className = className
    if (html) e.innerHTML = html
    return e
  }

  function siteHref (url) {
    // index URLs are root-relative to the site (e.g. /dse/6.9/...); make them relative to this page
    return (cfg.siteRootPath || '') + url
  }

  function componentLabel (doc) {
    var cvs = engine.store.componentVersions || {}
    var cv = cvs[doc.component + '/' + doc.version]
    if (!cv) return doc.component
    return cv.title + (doc.version && cv.displayVersion ? ' ' + cv.displayVersion : '')
  }

  // Entries are { url, title, path }, where url is site-relative (/dse/6.9/...#anchor). Anything
  // else in storage is ignored, and once the index is loaded, pages it no longer has are dropped.
  function readRecent () {
    var list
    try {
      list = JSON.parse(window.localStorage.getItem(RECENT_KEY) || '[]')
    } catch (e) {
      return []
    }
    if (!Array.isArray(list)) return []
    return list
      .filter(function (r) {
        return (
          r &&
          typeof r.url === 'string' &&
          /^\/(?!\/)/.test(r.url) &&
          typeof r.title === 'string' &&
          (!engine || pageUrls()[r.url.split('#')[0]])
        )
      })
      .map(function (r) {
        return { url: r.url, title: r.title, path: typeof r.path === 'string' ? r.path : '' }
      })
      .slice(0, RECENT_MAX)
  }

  function pageUrls () {
    if (!engine.urls) {
      engine.urls = {}
      var docs = engine.store.documents
      Object.keys(docs).forEach(function (id) {
        engine.urls[docs[id].url] = true
      })
    }
    return engine.urls
  }

  function saveRecent (entry) {
    try {
      var list = readRecent().filter(function (r) {
        return r.url !== entry.url
      })
      list.unshift(entry)
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, RECENT_MAX)))
    } catch (e) {
      // storage can be unavailable or full (private browsing, quotas); recent searches are optional
    }
  }

  function forgetRecent (url) {
    try {
      var list = readRecent().filter(function (r) {
        return r.url !== url
      })
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(list))
    } catch (e) {
      // as in saveRecent
    }
  }

  function command (keys, label) {
    var key = '<kbd class="DocSearch-Commands-Key">' + keys + '</kbd>'
    return '<li>' + key + '<span class="DocSearch-Label">' + label + '</span></li>'
  }

  function buildModal () {
    var container = el('div', 'DocSearch DocSearch-Container')
    container.setAttribute('role', 'dialog')
    container.setAttribute('aria-modal', 'true')
    container.setAttribute('aria-label', 'Search the docs')
    container.innerHTML =
      '<div class="DocSearch-Modal">' +
      '<header class="DocSearch-SearchBar">' +
      '<form class="DocSearch-Form" role="search" novalidate>' +
      '<label class="DocSearch-MagnifierLabel" for="site-search-input" id="site-search-label">' +
      '<span class="DocSearch-VisuallyHiddenForAccessibility">Search</span></label>' +
      '<div class="DocSearch-LoadingIndicator">' +
      ICONS.spinner +
      '</div>' +
      '<input class="DocSearch-Input" id="site-search-input" type="search" role="combobox" aria-expanded="false"' +
      ' aria-autocomplete="list" aria-controls="site-search-list" aria-labelledby="site-search-label"' +
      ' autocomplete="off" autocorrect="off" autocapitalize="off" enterkeyhint="go" spellcheck="false"' +
      ' placeholder="Search docs" maxlength="64">' +
      '<button type="reset" class="DocSearch-Reset" title="Clear the query" aria-label="Clear the query" hidden>' +
      ICONS.reset +
      '</button>' +
      '</form>' +
      '<button type="button" class="DocSearch-Cancel">Cancel</button>' +
      '</header>' +
      '<div class="DocSearch-Dropdown">' +
      '<div class="DocSearch-Dropdown-Container" id="site-search-list"></div>' +
      '</div>' +
      '<div class="DocSearch-Footer">' +
      '<div class="DocSearch-Logo"></div>' +
      '<ul class="DocSearch-Commands">' +
      command(ICONS.enter, 'to select') +
      command(ICONS.down + '</kbd><kbd class="DocSearch-Commands-Key">' + ICONS.up, 'to navigate') +
      command('<span class="DocSearch-Escape-Key">esc</span>', 'to close') +
      '</ul></div></div>'
    var modal = container.querySelector('.DocSearch-Modal')
    var input = container.querySelector('.DocSearch-Input')
    var form = container.querySelector('.DocSearch-Form')
    var reset = container.querySelector('.DocSearch-Reset')
    var list = container.querySelector('.DocSearch-Dropdown-Container')
    var dropdown = container.querySelector('.DocSearch-Dropdown')
    container.addEventListener('mousedown', function (e) {
      if (e.target === container) close()
    })
    // a click on a heading, the footer, or padding would otherwise move focus out of the dialog
    container.addEventListener('click', function (e) {
      if (ui && e.target.closest && !e.target.closest('a, button, input')) ui.input.focus({ preventScroll: true })
    })
    container.querySelector('.DocSearch-Cancel').addEventListener('click', close)
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      activate(e)
    })
    form.addEventListener('reset', function (e) {
      e.preventDefault()
      input.value = ''
      reset.hidden = true
      input.focus()
      render()
    })
    input.addEventListener('input', function () {
      reset.hidden = !input.value
      schedule()
    })
    container.addEventListener('keydown', onModalKeydown)
    var setHeight = function () {
      modal.style.setProperty('--docsearch-vh', window.innerHeight * 0.01 + 'px')
    }
    setHeight()
    return { container: container, input: input, list: list, dropdown: dropdown, setHeight: setHeight }
  }

  function schedule () {
    clearTimeout(pendingTimer)
    var query = ui.input.value.trim()
    // a short prefix expands to many index terms; wait a little longer while the reader types
    pendingTimer = setTimeout(render, query && query.length < 5 ? 150 : 60)
  }

  function setStalled (on) {
    if (ui) ui.container.classList.toggle('DocSearch-Container--Stalled', !!on)
  }

  function render () {
    if (!ui) return
    clearTimeout(pendingTimer)
    pendingTimer = null
    var query = ui.input.value.trim()
    if (!engine) {
      if (!query) return renderStart()
      // nothing to choose from until the index arrives (not even the recent searches)
      lastRendered = null
      resetList()
      setStalled(true)
      ensureIndex().then(render, renderError)
      return
    }
    setStalled(false)
    if (!query) return renderStart()
    if (lastRendered === query) return
    lastRendered = query
    var res = search(query)
    if (!res.pages.length) return renderNoResults(query)
    renderResults(res)
  }

  function resetList () {
    ui.list.innerHTML = ''
    items = []
    activeIndex = -1
    ui.dropdown.scrollTop = 0
    ui.input.removeAttribute('aria-activedescendant')
    ui.input.setAttribute('aria-expanded', 'false')
    ui.input.setAttribute('aria-controls', 'site-search-list')
  }

  // One listbox per group, labeled by the group heading, as DocSearch does
  function groupList (label) {
    var n = ui.list.querySelectorAll('.DocSearch-Hits').length
    var section = el('section', 'DocSearch-Hits')
    var source = el('div', 'DocSearch-Hit-source')
    source.id = 'site-search-group-label-' + n
    source.textContent = label
    section.appendChild(source)
    var ul = el('ul')
    ul.id = 'site-search-group-' + n
    ul.setAttribute('role', 'listbox')
    ul.setAttribute('aria-labelledby', source.id)
    section.appendChild(ul)
    ui.list.appendChild(section)
    ui.input.setAttribute('aria-controls', ui.input.getAttribute('aria-controls') + ' ' + ul.id)
    return ul
  }

  function renderStart () {
    lastRendered = null
    resetList()
    var recent = readRecent()
    if (!recent.length) {
      ui.list.appendChild(el('div', 'DocSearch-StartScreen', '<p class="DocSearch-Help">No recent searches</p>'))
      return
    }
    var ul = groupList('Recent')
    recent.forEach(function (r) {
      var li = hitItem(siteHref(r.url), ICONS.recent, r.title, r.path, null, false, false)
      li._entry.siteUrl = r.url
      var action = el('div', 'DocSearch-Hit-action')
      var remove = el('button', 'DocSearch-Hit-action-button', ICONS.remove)
      remove.title = 'Remove this search from history'
      remove.type = 'button'
      remove.addEventListener('click', function (e) {
        e.preventDefault()
        e.stopPropagation()
        forgetRecent(r.url)
        renderStart()
        ui.input.focus({ preventScroll: true }) // the button that had focus is gone
      })
      action.appendChild(remove)
      li.querySelector('.DocSearch-Hit-Container').appendChild(action)
      ul.appendChild(li)
    })
    setActive(0)
  }

  function renderNoResults (query) {
    resetList()
    var box = el('div', 'DocSearch-NoResults')
    box.appendChild(el('div', 'DocSearch-Screen-Icon', ICONS.noResults))
    var p = el('p', 'DocSearch-Title')
    p.appendChild(document.createTextNode('No results for "'))
    var strong = el('strong')
    strong.textContent = query
    p.appendChild(strong)
    p.appendChild(document.createTextNode('"'))
    box.appendChild(p)
    ui.list.appendChild(box)
  }

  function renderError () {
    if (!ui) return
    setStalled(false)
    resetList()
    ui.list.appendChild(
      el(
        'div',
        'DocSearch-ErrorScreen',
        '<p class="DocSearch-Title">Unable to load search</p>' +
          '<p class="DocSearch-Help">Check your network connection, then try again.</p>'
      )
    )
  }

  function hitItem (href, icon, title, path, rx, child, last) {
    var li = el('li', 'DocSearch-Hit' + (child ? ' DocSearch-Hit--Child' : ''))
    li.setAttribute('role', 'option')
    li.setAttribute('aria-selected', 'false')
    li.id = 'site-search-item-' + items.length
    var a = el('a')
    a.href = href
    var box = el('div', 'DocSearch-Hit-Container')
    if (child) box.insertAdjacentHTML('beforeend', last ? ICONS.treeLast : ICONS.tree)
    box.appendChild(el('div', 'DocSearch-Hit-icon', icon))
    var wrap = el('div', 'DocSearch-Hit-content-wrapper')
    var t = el('span', 'DocSearch-Hit-title')
    appendHighlighted(t, title, rx)
    wrap.appendChild(t)
    if (path) {
      var p = el('span', 'DocSearch-Hit-path')
      appendHighlighted(p, path, rx)
      wrap.appendChild(p)
    }
    box.appendChild(wrap)
    box.appendChild(el('div', 'DocSearch-Hit-action', ICONS.select))
    a.appendChild(box)
    li.appendChild(a)
    li.addEventListener('mousemove', function () {
      var i = items.indexOf(li)
      if (i !== activeIndex) setActive(i, true)
    })
    a.addEventListener('click', function (e) {
      remember(li)
      // a plain click follows the link and closes the dialog (it matters for links into this page)
      if (!(e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) close()
    })
    li._entry = { url: href, title: title, path: path || '' }
    items.push(li)
    return li
  }

  // Remembers the chosen hit for the start screen and announces the choice, so analytics can
  // listen for 'site-search:select' (DocSearch fed Algolia Analytics; nothing is sent by default).
  function remember (li) {
    var e = li._entry
    if (!e || !e.siteUrl) return
    saveRecent({ url: e.siteUrl, title: e.title, path: e.path })
    document.dispatchEvent(
      new CustomEvent('site-search:select', { detail: { query: ui ? ui.input.value : '', url: e.siteUrl } })
    )
  }

  function renderResults (res) {
    resetList()
    var rx = termRegExp(res.terms, res.typoWords)
    var groups = []
    var byLabel = {}
    res.pages.forEach(function (page) {
      var label = componentLabel(page.doc)
      if (!byLabel[label]) {
        byLabel[label] = { label: label, pages: [] }
        groups.push(byLabel[label])
      }
      byLabel[label].pages.push(page)
    })
    groups.forEach(function (g) {
      var ul = groupList(g.label)
      g.pages.forEach(function (page) {
        var doc = page.doc
        var path = page.textMatch ? snippet(doc.text, rx) : ''
        var li = hitItem(siteHref(doc.url), ICONS.page, doc.title, path, rx, false, false)
        li._entry.siteUrl = doc.url
        ul.appendChild(li)
        var sections = page.sections.slice(0, MAX_SECTIONS)
        sections.forEach(function (s, i) {
          var href = siteHref(doc.url) + (s.heading.hash ? '#' + s.heading.hash : '')
          var isLast = i === sections.length - 1
          var child = hitItem(href, ICONS.section, headingTitle(s.heading), doc.title, rx, true, isLast)
          child._entry.siteUrl = doc.url + (s.heading.hash ? '#' + s.heading.hash : '')
          child._entry.path = doc.title
          ul.appendChild(child)
        })
      })
    })
    setActive(0)
  }

  function setActive (i, fromMouse) {
    if (activeIndex > -1 && items[activeIndex]) items[activeIndex].setAttribute('aria-selected', 'false')
    activeIndex = i
    var li = items[i]
    if (!li) {
      ui.input.removeAttribute('aria-activedescendant')
      return
    }
    li.setAttribute('aria-selected', 'true')
    ui.input.setAttribute('aria-activedescendant', li.id)
    ui.input.setAttribute('aria-expanded', 'true')
    if (!fromMouse) li.scrollIntoView({ block: 'nearest' })
  }

  function activate (e) {
    if (pendingTimer) render() // act on what's typed now, not on the results of a keystroke ago
    if (!engine && ui.input.value.trim()) return // results aren't ready yet
    var li = items[activeIndex]
    if (!li) return
    var a = li.querySelector('a')
    remember(li)
    if (e && (e.metaKey || e.ctrlKey)) {
      window.open(a.href, '_blank', 'noopener')
    } else {
      close()
      window.location.assign(a.href)
    }
  }

  function onModalKeydown (e) {
    if (e.isComposing || e.keyCode === 229) return // the keystroke belongs to an input method
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (items.length) setActive((activeIndex + 1) % items.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (items.length) setActive((activeIndex - 1 + items.length) % items.length)
    } else if (e.key === 'Enter' && !(e.target.closest && e.target.closest('a, button'))) {
      e.preventDefault()
      activate(e)
    } else if (e.key === 'Tab') {
      keepFocusInside(e)
    }
  }

  // Tab and Shift+Tab move among the dialog's controls that are showing, and wrap around at either
  // end instead of leaving the dialog.
  function keepFocusInside (e) {
    var focusables = Array.prototype.filter.call(
      ui.container.querySelectorAll('input, button:not([hidden]), a[href]'),
      function (node) {
        return node.getClientRects().length > 0
      }
    )
    var at = focusables.indexOf(document.activeElement)
    var next = e.shiftKey ? at - 1 : at + 1
    if (at >= 0 && next >= 0 && next < focusables.length) return // the browser moves focus
    e.preventDefault()
    var target = e.shiftKey && at >= 0 ? focusables[focusables.length - 1] : focusables[0]
    if (target) target.focus()
  }

  // While the dialog is open: Escape closes it wherever focus is, and focus can't stay on the
  // page behind it.
  function onDocumentKeydown (e) {
    if (!ui || ui.container.contains(e.target)) return
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
    } else if (/^(ArrowUp|ArrowDown|Enter|Tab)$/.test(e.key)) {
      ui.input.focus({ preventScroll: true })
      onModalKeydown(e)
    }
  }

  function onDocumentFocusin (e) {
    if (ui && !ui.container.contains(e.target)) ui.input.focus({ preventScroll: true })
  }

  function open (initialQuery) {
    if (ui) return
    lastFocus = document.activeElement
    ui = buildModal()
    document.body.appendChild(ui.container)
    document.body.classList.add('DocSearch--active')
    var selection = initialQuery || (window.getSelection ? String(window.getSelection()).slice(0, 64) : '')
    if (selection && !/\n/.test(selection)) {
      ui.input.value = selection
      ui.container.querySelector('.DocSearch-Reset').hidden = false
    }
    ui.input.focus()
    document.addEventListener('keydown', onDocumentKeydown, true)
    document.addEventListener('focusin', onDocumentFocusin)
    window.addEventListener('resize', ui.setHeight)
    if (!engine) {
      if (ui.input.value) setStalled(true)
      ensureIndex().then(render, renderError)
    }
    render()
  }

  function close () {
    if (!ui) return
    clearTimeout(pendingTimer)
    pendingTimer = null
    document.removeEventListener('keydown', onDocumentKeydown, true)
    document.removeEventListener('focusin', onDocumentFocusin)
    window.removeEventListener('resize', ui.setHeight)
    ui.container.remove()
    ui = null
    items = []
    lastRendered = null
    document.body.classList.remove('DocSearch--active')
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true })
  }

  function isEditable (target) {
    var tag = target && target.tagName
    return tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || (target && target.isContentEditable)
  }

  function initButton () {
    var button = document.querySelector('#docsearch .DocSearch-Button, #site-search-button')
    if (!button) return
    var keys = button.querySelectorAll('.DocSearch-Button-Key')
    if (IS_MAC && keys[0]) {
      keys[0].textContent = '⌘'
      keys[0].classList.remove('DocSearch-Button-Key--text')
      button.setAttribute('aria-label', 'Search (Command+K)')
    }
    var prefetch = function () {
      ensureIndex().catch(function () {})
    }
    button.addEventListener('pointerenter', prefetch, { once: true })
    button.addEventListener('focus', prefetch, { once: true })
    button.addEventListener('touchstart', prefetch, { once: true, passive: true })
    button.addEventListener('click', function () {
      open()
    })
    window.addEventListener('keydown', function (e) {
      var key = e.key && e.key.toLowerCase()
      if ((e.metaKey || e.ctrlKey) && key === 'k') {
        e.preventDefault()
        ui ? close() : open()
      } else if (!ui && key === '/' && !isEditable(e.target)) {
        e.preventDefault()
        open()
      }
    })
  }

  window.siteSearch = {
    open: open,
    close: close,
    load: ensureIndex,
    search: function (query) {
      return ensureIndex().then(function () {
        return search(query)
      })
    },
    metrics: metrics,
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initButton)
  else initButton()
})()
