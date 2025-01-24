;(function () {
  'use strict'

  window.analytics.ready(() => {
    window.ketch('once', 'consent', onKetchConsent)
    window.ketch('on', 'consent', onKetchConsentGtagTrack)
    window.ketch('on', 'userConsentUpdated', onKetchConsentUpdated)
  })

  // If the user is in the US-CA region, change the text of the preference center link
  window.ketch('on', 'regionInfo', (regionInfo) => {
    const customTextRegions = ['US-CA']
    if (customTextRegions.includes(regionInfo)) {
      const preferenceCenterLinkElement = document.getElementById('preferenceCenterLink')
      if (preferenceCenterLinkElement) {
        preferenceCenterLinkElement.textContent = 'Do Not Sell My Personal Information'
      }
    }
  })

  // If the user is in the default jurisdiction, remove the preference center link
  window.ketch('on', 'jurisdiction', (jurisdiction) => {
    if (jurisdiction.includes('default')) {
      const preferenceCenterContainerElement = document.getElementById('preferenceCenterContainer')
      if (preferenceCenterContainerElement) {
        preferenceCenterContainerElement.remove()
      }
    }
  })

  // Once - This will be fired only one time, will initialize all the main features.
  const onKetchConsent = (consent) => {
    window.ketchConsent = consent
    addKetchConsentToContextMiddleware()
    window.analytics.page('Consent Update')
    // loadScripts(); // Load any script if we have scripts to fire after ketch consent is fired.
  }

  // on - Each time the user changes the preferences, save them to the global variable
  const onKetchConsentUpdated = (consent) => {
    window.ketchConsent = consent
  }

  // On - each time the consent is loaded, track it to the gtag event
  const onKetchConsentGtagTrack = (consent) => {
    if (window.gtag &&
        consent.purposes &&
        'analytics' in consent.purposes &&
        'targeted_advertising' in consent.purposes
    ) {
      const analyticsString = consent.purposes.analytics === true ? 'granted' : 'denied'
      const targetedAdsString = consent.purposes.targeted_advertising === true ? 'granted' : 'denied'

      const gtagObject = {
        analytics_storage: analyticsString,
        ad_personalization: targetedAdsString,
        ad_storage: targetedAdsString,
        ad_user_data: targetedAdsString,
      }
      window.gtag('consent', 'update', gtagObject)
    }
  }

  // Use the analytics.addSourceMiddleware function to include the consent on all the events
  const addKetchConsentToContextMiddleware = () => {
    window.analytics.addSourceMiddleware(({ payload, next }) => {
      if (window.ketchConsent) {
        const analyticsString = window.ketchConsent.purposes.analytics === true ? 'granted' : 'denied'
        const targetedAdsString = window.ketchConsent.purposes.targeted_advertising === true ? 'granted' : 'denied'

        payload.obj.properties = {
          ...(payload.obj.properties || {}),
          analyticsStorageConsentState: analyticsString,
          adsStorageConsentState: targetedAdsString,
          adUserDataConsentState: targetedAdsString,
          adPersonalizationConsentState: targetedAdsString,
        }
        payload.obj.context.consent = {
          categoryPreferences: window.ketchConsent?.purposes,
        }
      }
      next(payload)
    })
  }
})()
