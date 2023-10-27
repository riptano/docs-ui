'use strict'

module.exports = (val) => {
  if (typeof val === 'string') {
    const str = val.split(', ')
    return str
  } else {
    throw new Error('{{split}} helper expects a string argument')
  }
}
