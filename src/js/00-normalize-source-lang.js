;(function () {
  'use strict'

  // An AsciiDoc source block written as [source,language-bash] makes Asciidoctor emit
  // class="language-language-bash" and data-lang="language-bash". highlight.js then finds no
  // matching language and leaves the block plain, and the source toolbox shows "language-bash".
  // Strip the redundant prefix before the toolbox (06-copy-to-clipboard.js) and the
  // highlight.js bundle (loaded async after this script) read the language.
  var REDUNDANT_PREFIX_RX = /^(?:language-)+/i

  ;[].slice.call(document.querySelectorAll('pre.highlight > code[data-lang]')).forEach(function (code) {
    var lang = code.dataset.lang
    if (!REDUNDANT_PREFIX_RX.test(lang)) return
    var normalized = lang.replace(REDUNDANT_PREFIX_RX, '')
    code.classList.remove('language-' + lang)
    if (normalized) {
      code.classList.add('language-' + normalized)
      code.dataset.lang = normalized
    } else {
      delete code.dataset.lang
    }
  })
})()
