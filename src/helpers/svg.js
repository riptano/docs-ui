'use strict'

const fs = require('fs')
const path = require('path')

module.exports = (iconName) => {
  const pathName = path.join(__dirname, '/src/img/', iconName + '.svg')
  const content = fs.readFileSync(pathName, 'utf8')
  return content
}
