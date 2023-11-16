;(function () {
  'use strict'

  var help = document.getElementById('get-support')

  help.onclick = function () {
    try {
      window.Intercom('show')
    } catch (e) {}
  }
})()
