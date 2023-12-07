'use strict'

const logger = require('@antora/logger')('hbs-helper:svg')

/**
 * A Handlebars helper that returns the contents of an SVG file within the content catalog.
 *
 * Example: Using an asciidoc page attribute to render an svg:
 *  asciidoc:  :page-icon: ROOT:ui/icons/icon.svg
 *  handlebars: {{svg page.attributes.icon}}
 */
module.exports = (target, { data }) => {
  const { contentCatalog, page } = data.root

  if (!contentCatalog) return

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
