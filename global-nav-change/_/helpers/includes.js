'use strict'

module.exports = (searchValue, start, ignoreCase = false) => {
  if (!searchValue || !start) return false
  if (ignoreCase && typeof searchValue === 'string' && typeof start === 'string') {
    searchValue = searchValue.toLowerCase()
    start = start.toLowerCase()
  }
  return start.includes(searchValue)
}
