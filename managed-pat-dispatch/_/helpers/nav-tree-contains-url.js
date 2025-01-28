'use strict'

// Walk the nav tree on a given page and return true if it contains the given URL.
// Used in the side nav to determine which nav items should be expanded when a page is loaded.
function navTreeContainsUrl (items, pageUrl) {
  return items.reduce((isFound, item) => {
    if (isFound) return true
    if (item.url === pageUrl) return true
    if (item.items) return navTreeContainsUrl(item.items, pageUrl)
    return false
  }, false)
}

module.exports = (items, pageUrl) => navTreeContainsUrl(items, pageUrl)
