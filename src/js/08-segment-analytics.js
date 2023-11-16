;(function () {
  'use strict'

  if (window.analytics) {
    const trackedLinkElements = document.querySelectorAll('a[data-track]')
    const trackedElements = document.querySelectorAll('[data-track]:not(a)')

    trackedLinkElements.forEach((element) => {
      window.analytics.trackLink(element, element.dataset.track)
    })

    trackedElements.forEach((element) => {
      element.addEventListener('click', (e) => {
        window.analytics.track(element.dataset.track)
      })
    })
  }
})()
