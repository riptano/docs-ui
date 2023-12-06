'use strict'

const logger = require('@antora/logger')('hbs-helper:svg')
const fs = require('fs-extra')

const readFile = (target) => {
  return fs.readFileSync(target, 'utf-8', (err, content) => {
    if (err) {
      return logger.error({ target, err }, `error reading file: ${target}`)
    }
    return content
  })
}

/**
 * A Handlebars helper that returns the contents of an SVG file within the content catalog.
 *
 * Example: Using an asciidoc page attribute to render an svg:
 *  asciidoc:  :page-icon: ROOT:ui/icons/icon.svg
 *  handlebars: {{svg page.attributes.icon}}
 */
module.exports = (target, { data }) => {
  const { contentCatalog, page } = data.root

  // If content catalog is not available, try reading the file directly.
  // This is only useful for the UI preview.
  if (!contentCatalog) return readFile(target)

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
