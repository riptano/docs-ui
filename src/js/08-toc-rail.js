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
        var tag = document.createElement('span')
        tag.classList.add('tag')
        tag.setAttribute('role', 'button')
        tag.setAttribute('tabindex', '0')
        tag.onclick = function () {
          window.alert(toKebabCase(s.trim()))
        }
        tag.textContent = s
        tags.appendChild(tag)
      })
      container.appendChild(title)
      container.appendChild(tags)
    }
  }

  function toKebabCase (str) {
    if (!str) return undefined
    return str
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      .map((x) => x.toLowerCase())
      .join('-')
  }
})()
