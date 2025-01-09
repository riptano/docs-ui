;(function () {
  'use strict'

  if (window.analytics) {
    const trackedLinkElements = document.querySelectorAll('a[data-track]')
    const trackedElements = document.querySelectorAll('[data-track]:not(a)')

    const context = {
      consent: {
        categoryPreferences: {
          advertising: 'behavioral_advertising',
          ketch_purpose_code: 'ketch_purpose_code',
          analytics: 'analytics',
          data_broking: 'data_broking',
          personalization: 'personalization',
          essential_services: 'essential_services',
        },
      },
    }

    trackedLinkElements.forEach((element) => {
      window.analytics.trackLink(element, element.dataset.track, context)
    })

    trackedElements.forEach((element) => {
      element.addEventListener('click', (e) => {
        window.analytics.track(element.dataset.track, context)
      })
    })
  }
})()
