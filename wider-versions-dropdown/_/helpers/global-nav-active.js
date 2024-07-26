'use strict'

module.exports = module.exports = (navItem, {
  data: {
    root: { page, site },
  },
}) => {
  const pageVersion = page.componentVersion?.version
  const pageComponent = page.component?.name

  const getIgnoredActiveComponents = (items) => {
    return items.reduce((acc, item) => {
      if (item.ignoreActiveComponent) {
        acc[item.url] = item.component
      }
      if (item.items) {
        acc = { ...acc, ...getIgnoredActiveComponents(item.items) }
      }
      return acc
    }, {})
  }

  const ignoredActiveComponents = getIgnoredActiveComponents(site.keys.globalNav)

  const matchesComponentAndVersion = (item) => {
    if (ignoredActiveComponents[page.url] === pageComponent && !item.ignoreActiveComponent) {
      return false
    }
    if (item.ignoreActiveComponent) {
      return item.url === page.url
    }
    if (item.component) {
      if (item.version && pageVersion) {
        return item.component === pageComponent && item.version === pageVersion
      }
      return item.component === pageComponent
    }
    return false
  }

  if (navItem.items) {
    return navItem.items.some(matchesComponentAndVersion)
  } else {
    return matchesComponentAndVersion(navItem)
  }
}
