'use strict'

module.exports = module.exports = (navItem, {
  data: {
    root: { page },
  },
}) => {
  const pageVersion = page.componentVersion?.version
  const pageComponent = page.component?.name

  const matchesComponentAndVersion = (item) => {
    if (pageVersion) {
      return item.component === pageComponent && item.version === pageVersion
    } else {
      return item.component === pageComponent
    }
  }

  if (navItem.component) {
    return matchesComponentAndVersion(navItem)
  }

  if (navItem.items) {
    return navItem.items.some(matchesComponentAndVersion)
  }

  return false
}
