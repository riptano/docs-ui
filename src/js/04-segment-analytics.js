;(function () {
  'use strict'

  const ketchConsentContext = {
    context: {
      consent: {
        categoryPreferences: {
          ...(window.ketchConsent?.purposes || {
            analytics: false,
            essential_services: false,
            targeted_advertising: false,
          }),
        },
      },
    },
  }

  const trackEvent = (name, payload) => {
    if (window.analytics) {
      window.analytics.track(name, {
        ...(payload || {}),
        ...ketchConsentContext,
      })
    }
  }

  const trackLinkEvent = (element, name, payload) => {
    if (window.analytics) {
      window.analytics.trackLink(element, name, {
        ...(payload || {}),
        ...ketchConsentContext,
      })
    }
  }

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
  // All tracking events should be done through these functions because they handle the Ketch consent context.
  window.trackEvent = trackEvent
  window.trackLinkEvent = trackLinkEvent
})()
