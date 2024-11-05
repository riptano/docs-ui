;(function () {
  'use strict'

  var docsearch = require('@docsearch/js')
  var config = (document.currentScript || {}).dataset || {}

  docsearch({
    container: '#docsearch',
    appId: config.algoliaAppId,
    indexName: config.algoliaIndexName,
    // This is the public API key which can be safely used in frontend code.
    apiKey: config.algoliaApiKey,
  })
})()
