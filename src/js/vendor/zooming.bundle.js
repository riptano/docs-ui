;(function () {
  'use strict'

  const Zooming = require('zooming')

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const zooming = new Zooming({ bgColor: 'rgb(10, 10, 10)', bgOpacity: 0.6, scaleBase: 0.8, transitionDuration: prefersReducedMotion ? 0.01 : 0.3 })

  zooming.listen('.doc .imageblock img, .doc .image img')
})()
