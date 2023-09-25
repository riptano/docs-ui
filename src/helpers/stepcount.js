'use strict'

module.exports = (html) => {
  const matches = html.toString().match(/class="step"/g)
  if (!matches) return undefined
  return matches.length
}
