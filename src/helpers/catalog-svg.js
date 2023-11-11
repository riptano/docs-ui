'use strict'

const logger = require('@antora/logger')('helper:catalog-svg')

module.exports = (target, { data }) => {
  const { contentCatalog, page } = data.root
  const pageContext = { component: page.component.name, version: page.component.latest.version, module: page.module }
  const resolvedPage = contentCatalog.resolvePage(page.relativeSrcPath, pageContext)
  if (!resolvedPage) {
    return logger.error({ page: page.relativeSrcPath, pageContext }, `page not found: ${page.relativeSrcPath}`)
  }
  const svgFile = contentCatalog.resolveResource(target, resolvedPage.src, 'image', [
    'image',
  ])
  if (!svgFile) return logger.error({ target, file: resolvedPage.src }, `target of svg not found: ${target}`)
  return svgFile.contents
}
