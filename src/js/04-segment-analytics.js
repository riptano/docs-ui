;(function () {
  'use strict'

  const trackEvent = (name, payload) => {
    if (window.analytics) {
      window.analytics.track(name, payload || {})
    }
  }

  const trackLinkEvent = (element, name, payload) => {
    if (window.analytics) {
      window.analytics.trackLink(element, name, payload || {})
    }
  }

  // Add click event listeners to all elements with a data-track attribute.
  if (window.analytics) {
    const trackedLinkElements = document.querySelectorAll('a[data-track]')
    const trackedElements = document.querySelectorAll('[data-track]:not(a)')

    trackedLinkElements.forEach((element) => {
      trackLinkEvent(element, element.dataset.track)
    })

    trackedElements.forEach((element) => {
      element.addEventListener('click', (e) => {
        trackEvent(element.dataset.track)
      })
    })
  }

  // Expose trackEvent and trackLinkEvent to the global scope.
  window.trackEvent = trackEvent
  window.trackLinkEvent = trackLinkEvent
})()
