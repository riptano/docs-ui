'use strict'

const { execSync } = require('child_process')
const fs = require('fs')
const logger = require('@antora/logger')('assets-manifest-helper')

module.exports = (assetPath) => {
  let manifestPath
  let manifest
  try {
    manifestPath = execSync('find ./build/site -name assets-manifest.json').toString().trim()
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
  } catch (err) {
    logger.error(err)
  }
  if (manifest) return manifest[assetPath]
  return assetPath
}
