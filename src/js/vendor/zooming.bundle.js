;(function () {
  'use strict'

  const Zooming = require('zooming')

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const zooming = new Zooming({
    bgColor: 'var(--ds-background-body)',
    bgOpacity: 0.9,
    scaleBase: 0.8,
    transitionDuration: prefersReducedMotion ? 0.01 : 0.3,
  })

  zooming.listen('.doc .imageblock:not(.no-zoom) img, .doc .image:not(.no-zoom) img')
})()
