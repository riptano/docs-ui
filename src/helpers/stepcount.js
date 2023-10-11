'use strict'

module.exports = (html) => {
  const matches = html.toString().match(/class(?=="((.*?\s)?step(\s.*?)?)")/g)
  if (!matches) return undefined
  return matches.length
}
