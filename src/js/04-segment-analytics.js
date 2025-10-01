;(function () {
  'use strict'

  // Get common properties from digitalData
  const getCommonProperties = () => {
    return window.digitalData?.page?.pageInfo?.segment?.commonProperties || {}
  }

  /**
   * Track events with IBM Segment Common Schema
   * @param {string} name - Event name (e.g., "CTA Clicked", "UI Interaction")
   * @param {object} payload - Event properties
   */
  const trackEvent = (name, payload) => {
    if (window.analytics) {
      // Merge common properties with event-specific properties
      const eventProperties = {
        ...getCommonProperties(),
        ...(payload || {}),
      }
      window.analytics.track(name, eventProperties)
    }
  }

  /**
   * Track link clicks with IBM Segment Common Schema
   * @param {HTMLElement} element - The link element
   * @param {string} name - Event name
   * @param {object} payload - Event properties
   */
  const trackLinkEvent = (element, name, payload) => {
    if (window.analytics) {
      const eventProperties = {
        ...getCommonProperties(),
        ...(payload || {}),
      }
      window.analytics.trackLink(element, name, eventProperties)
    }
  }

  /**
   * Initialize data-attribute tracking for declarative analytics
   * Supports both legacy data-track and new IBM schema patterns
   */
  const initDataAttributeTracking = () => {
    // Handle data-event attributes (IBM Schema pattern)
    const handleClick = (event) => {
      const target = event.target
      const trackingElement = target.closest('[data-event]')

      if (!trackingElement) return

      const eventName = trackingElement.dataset.event
      if (!eventName) return

      const properties = {}

      // Extract all data attributes and map to event properties
      Object.keys(trackingElement.dataset).forEach((key) => {
        if (key !== 'event') {
          // Map to IBM Segment property names (preserve exact casing per schema)
          let propertyKey = key

          // Handle special IBM property mappings
          if (key === 'cta') propertyKey = 'CTA'
          else if (key === 'elementId') propertyKey = 'elementId'
          else if (key === 'topLevel') propertyKey = 'topLevel'
          else if (key === 'subLevel') propertyKey = 'subLevel'

          properties[propertyKey] = trackingElement.dataset[key]
        }
      })

      trackEvent(eventName, properties)
    }

    document.removeEventListener('click', handleClick)
    document.addEventListener('click', handleClick)

    // Legacy data-track support for backwards compatibility
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

  // Initialize tracking when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDataAttributeTracking)
  } else {
    initDataAttributeTracking()
  }

  // Expose functions to the global scope
  window.trackEvent = trackEvent
  window.trackLinkEvent = trackLinkEvent
})()
