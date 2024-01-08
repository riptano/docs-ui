'use strict'

function navTreeContainsUrl (items, pageUrl) {
  return items.reduce((isFound, item) => {
    if (isFound) return true
    if (item.url === pageUrl) return true
    if (item.items) return navTreeContainsUrl(item.items, pageUrl)
    return false
  }, false)
}

module.exports = (items, pageUrl) => navTreeContainsUrl(items, pageUrl)
