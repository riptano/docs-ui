'use strict'

const logger = require('@antora/logger')('assets-manifest-helper')

module.exports = (assetPath) => {
  const manifest = global.assetsManifest
  if (!manifest) {
    logger.error(
      `
      Assets manifest not found in global context.
      The .js and .css files from the UI bundle will not be linked properly in the HTML.
      Ensure assets-manifest.json from the UI bundle is parsed and added 
      to global.assetsManifest after uiLoader is complete.
      `
    )
    return assetPath
  }
  return manifest[assetPath]
}
