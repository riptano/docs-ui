'use strict'

const path = require('path')

module.exports = (iconName, { data }) => {
  const uiRootPath = data.root.uiRootPath
  const svgFilePath = path.join(uiRootPath, 'img', iconName + '.svg')
  return '<img src="' + svgFilePath + '" alt="' + iconName + '" />'
}
