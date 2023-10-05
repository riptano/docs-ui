;(function () {
  'use strict'

  /* toc container */
  var toc = document.querySelector('aside.toc.sidebar')

  if (toc) {
    tags(toc)
  }

  function tags (toc) {
    var tagList = document.getElementsByTagName('meta').keywords
    if (tagList) {
      var title = document.createElement('h3')
      title.textContent = 'Tags'
      var list = tagList.content.split(',')
      var container = toc.querySelector('.toc-tags')
      var tags = document.createElement('div')
      list.forEach((s) => {
        var el = document.createElement('span')
        el.textContent = s
        tags.appendChild(el)
      })
      container.appendChild(title)
      container.appendChild(tags)
    }
  }
})()
