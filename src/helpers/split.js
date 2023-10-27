'use strict'

module.exports = (val) => {
  if(typeof val === 'string') {
    const str = val.split(', ')
    console.log(str)
    return str
  } else {
    return 'no string :('
  }
  //return typeof val
  //if (typeof val === 'string') {
    //const array = val.split(',')
    //return 'yes its a string'
  //} else {
  //  throw new Error('{{split}} helper expects a string argument')
  //}
}
