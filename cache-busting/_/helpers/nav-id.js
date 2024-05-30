'use strict'

module.exports = (level = 0, content) => {
  if (!content) return
  return `${level}-${content.replace(/\s+/g, '-').toLowerCase()}`
}
