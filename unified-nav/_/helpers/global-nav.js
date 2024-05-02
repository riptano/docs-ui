'use strict'

const mapNavList = (list, contentCatalog) => {
  return list.map((item) => {
    if (item.xref) {
      const page = contentCatalog.resolvePage(item.xref)
      if (page) item.url = page.pub.url
      if (page?.src?.component) {
        item.component = page.src.component
      }
      if (page?.src?.version) {
        item.version = page.src.version
      }
      item.urlType = 'internal'
      delete item.xref
    }
    if (item.url && item.url.startsWith('http')) item.urlType = 'external'
    if (item.items) {
      item.items = mapNavList(item.items, contentCatalog)
    }
    return item
  })
}

module.exports = ({
  data: {
    root: {
      contentCatalog = { resolvePage: () => undefined, getComponent: () => undefined },
      site,
    },
  },
}) => {
  let globalNav = site.keys.globalNav

  if (!globalNav) return []
  if (globalNav._compiled) return globalNav

  globalNav = mapNavList(JSON.parse(globalNav), contentCatalog)

  globalNav._compiled = true

  site.keys.globalNav = globalNav
  return globalNav
}
