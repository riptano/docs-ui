module.exports = ({ data }) => {
  const { contentCatalog, site } = data.root
  if (!contentCatalog) return
  const pages = contentCatalog.getPages(({ asciidoc, out }) => {
    if (!out || !asciidoc) return
    return asciidoc.attributes['page-integration-tags']
  })
  const { buildPageUiModel } = require.main.require('@antora/page-composer/build-ui-model')
  return pages.map((page) => buildPageUiModel(site, page, contentCatalog))
}
