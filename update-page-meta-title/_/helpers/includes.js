'use strict'

module.exports = (searchValue, start) => {
  if (!searchValue || !start) return false
  return start.includes(searchValue)
}
