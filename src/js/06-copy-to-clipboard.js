;(function () {
  'use strict'

  var CMD_RX = /^\$ (\S[^\\\n]*(\\\n(?!\$ )[^\\\n]*)*)(?=\n|$)/gm
  var LINE_CONTINUATION_RX = /( ) *\\\n *|\\\n( ?) */g
  var TRAILING_SPACE_RX = / +$/gm

  var config = (document.getElementById('site-script') || { dataset: {} }).dataset
  var uiRootPath = config.uiRootPath == null ? '.' : config.uiRootPath
  var svgAs = config.svgAs
  var supportsCopy = window.navigator.clipboard

  ;[].slice.call(document.querySelectorAll('.doc pre.highlight, .doc .literalblock pre')).forEach(function (pre) {
    var code, language, lang, copy, toast, toolbox, title, listingblock
    if (pre.classList.contains('highlight')) {
      code = pre.querySelector('code')
      if ((language = code.dataset.lang) && language !== 'console') {
        ;(lang = document.createElement('span')).className = 'source-lang'
        lang.appendChild(document.createTextNode(language))
      }
    } else if (pre.innerText.startsWith('$ ')) {
      var block = pre.parentNode.parentNode
      block.classList.remove('literalblock')
      block.classList.add('listingblock')
      pre.classList.add('highlightjs', 'highlight')
      ;(code = document.createElement('code')).className = 'language-console hljs'
      code.dataset.lang = 'console'
      code.appendChild(pre.firstChild)
      pre.appendChild(code)
    } else {
      return
    }
    listingblock = pre.parentNode.parentNode
    var nolang = listingblock.classList.contains('nolang')
    ;(toolbox = document.createElement('div')).className = 'source-toolbox'
    if (listingblock.firstElementChild.classList.contains('title')) {
      title = listingblock.firstElementChild
    }
    if (supportsCopy) {
      ;(copy = document.createElement('button')).className = 'copy-button'
      copy.setAttribute('title', 'Copy to clipboard')
      if (svgAs === 'svg') {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttribute('class', 'copy-icon')
        var use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
        use.setAttribute('href', uiRootPath + '/img/octicons-16.svg#icon-clippy')
        svg.appendChild(use)
        copy.appendChild(svg)
      } else {
        var span = document.createElement('span')
        span.className = 'material-icons'
        span.innerText = 'content_paste'
        copy.appendChild(span)
      }
      ;(toast = document.createElement('span')).className = 'copy-toast'
      toast.appendChild(document.createTextNode('Copied!'))
      copy.appendChild(toast)
      toolbox.appendChild(copy)
    }
    if (copy) {
      copy.addEventListener('click', writeToClipboard.bind(copy, code))
      pre.prepend(toolbox)
    }
    if (lang && !title && !nolang) {
      ;(title = document.createElement('div')).className = 'title'
      title.appendChild(lang)
      listingblock.prepend(title)
    }
    if (lang && title && !nolang) {
      title.appendChild(lang)
    }
  })

  function extractCommands (text) {
    var cmds = []
    var m
    while ((m = CMD_RX.exec(text))) cmds.push(m[1].replace(LINE_CONTINUATION_RX, '$1$2'))
    return cmds.join(' && ')
  }

  function writeToClipboard (code) {
    var text = code.innerText.replace(TRAILING_SPACE_RX, '')
    if (code.dataset.lang === 'console' && text.startsWith('$ ')) text = extractCommands(text)
    window.navigator.clipboard.writeText(text).then(
      function () {
        const icon = this.querySelector('.material-icons')
        this.classList.add('clicked')
        icon.innerText = 'assignment_turned_in'
        this.offsetHeight // eslint-disable-line no-unused-expressions
        this.classList.remove('clicked')
        setTimeout(function () {
          icon.innerText = 'content_paste'
        }, 500)
      }.bind(this),
      function () {}
    )
  }
})()
