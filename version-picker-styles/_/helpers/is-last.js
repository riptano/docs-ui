'use strict'

module.exports = (item, array) => {
  if (!item || !array) return false
  if (!Array.isArray(array)) return false
  return JSON.stringify(item) === JSON.stringify(array.slice(-1)[0])
}
