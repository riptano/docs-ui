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

  // Save the Ketch consent state to the global scope and add consent middleware to analytics calls.
  if (window && window.ketch && window.analytics) {
    const saveConsent = (consent) => {
      window.ketchConsent = consent
    }
    window.ketch('on', 'consent', saveConsent)
    window.ketch('on', 'userConsentUpdated', saveConsent)
    window.ketch('on', 'regionInfo', (regionInfo) => {
      const customTextRegions = ['US-CA']
      if (customTextRegions.includes(regionInfo)) {
        const preferenceCenterLinkElement = document.getElementById('preferenceCenterLink')
        preferenceCenterLinkElement.textContent = 'Do Not Sell My Personal Information'
      }
    })
    window.analytics.addSourceMiddleware(({ payload, next }) => {
      if (window.ketchConsent) {
        payload.obj.properties = {
          ...(payload.obj.properties || {}),
          'Analytics Storage Consent State':
            (window.ketchConsent?.purposes || {})?.analytics === true
              ? 'granted'
              : 'denied',
          'Ads Storage Consent State':
            (window.ketchConsent?.purposes || {})?.targeted_advertising === true
              ? 'granted'
              : 'denied',
          'Ad User Data Consent State':
            (window.ketchConsent?.purposes || {})?.targeted_advertising === true
              ? 'granted'
              : 'denied',
          context: {
            consent: {
              categoryPreferences: window.ketchConsent?.purposes || {},
            },
          },
          traits: window.ketchConsent?.purposes || {},
        }
        payload.obj.context.consent = {
          categoryPreferences: window.ketchConsent?.purposes,
        }
      }
      next(payload)
    })
  }
})()
