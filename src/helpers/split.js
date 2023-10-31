'use strict'

module.exports = (val, char) => {
  if (typeof val === 'string') {
    const arr = val.split(char)
    return arr
  } else {
    throw new Error('{{split}} helper expects a string argument')
  }
}
