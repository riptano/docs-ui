;(function () {
  'use strict'

  /**
   * IBM Segment Event Types:
   * - 'CTA Clicked': Call-to-action clicks (links, buttons)
   * - 'UI Interaction': General UI interactions (excludes userId)
   * - 'User Form': Form interactions (handled separately in form-specific files)
   */

  // Determine if a data-track event should be CTA Clicked or UI Interaction
  const getEventType = (eventName) => {
    // Links are typically CTAs
    if (eventName.includes('Link Clicked') || eventName.includes('Clicked')) {
      return 'CTA Clicked'
    }
    // Buttons and other interactions
    if (eventName.includes('Button') || eventName.includes('Form')) {
      return 'UI Interaction'
    }
    // Default to UI Interaction
    return 'UI Interaction'
  }

  // Extract CTA text from event name or element
  const extractCTA = (eventName, element) => {
    if (element) {
      return element.textContent?.trim() || element.getAttribute('title') || eventName
    }
    return eventName
  }

  // Extract namespace from event name
  const extractNamespace = (eventName) => {
    if (eventName.includes('Footer')) return 'footer'
    if (eventName.includes('Tutorial')) return 'tutorial'
    if (eventName.includes('Feedback')) return 'feedback'
    if (eventName.includes('Edit')) return 'content'
    if (eventName.includes('Colab')) return 'tutorial'
    return 'docs'
  }

  // Extract action from event name
  const extractAction = (eventName) => {
    if (eventName.includes('Clicked')) return 'clicked'
    if (eventName.includes('Submitted')) return 'submitted'
    if (eventName.includes('Copied')) return 'copied'
    return 'interacted'
  }

  const trackEvent = (name, payload = {}, element = null) => {
    if (window.analytics && window.getSegmentCommonProperties) {
      const eventType = getEventType(name)
      const commonProps = window.getSegmentCommonProperties(eventType)

      let eventPayload = { ...commonProps, ...payload }

      if (eventType === 'CTA Clicked') {
        eventPayload = {
          ...eventPayload,
          CTA: extractCTA(name, element),
          location: extractNamespace(name),
        }
      } else if (eventType === 'UI Interaction') {
        eventPayload = {
          ...eventPayload,
          action: extractAction(name),
          CTA: extractCTA(name, element),
          namespace: extractNamespace(name),
          elementId: element?.id || '',
          payload: payload,
        }
      }

      window.analytics.track(eventType, eventPayload)
    }
  }

  const trackLinkEvent = (element, name, payload = {}) => {
    if (window.analytics && window.getSegmentCommonProperties) {
      const eventType = 'CTA Clicked' // Links are always CTAs
      const commonProps = window.getSegmentCommonProperties(eventType)

      const eventPayload = {
        ...commonProps,
        ...payload,
        CTA: extractCTA(name, element),
        location: extractNamespace(name),
        type: 'Link',
        text: element.textContent?.trim() || element.getAttribute('title') || '',
      }

      window.analytics.trackLink(element, eventType, eventPayload)
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
        trackEvent(element.dataset.track, {}, element)
      })
    })
  }

  /**
   * Track page view with friendly name
   * IBM requires page events to have a friendly "page" property
   */
  const trackPage = (pageName) => {
    if (window.analytics && window.SEGMENT_COMMON_PROPERTIES) {
      // Get friendly page name from title or use provided name
      const friendlyName = pageName || document.title.split('|')[0].trim()

      // Get common properties for page event (excludes userId per IBM requirements)
      const pageProperties = window.getSegmentCommonProperties('page')

      window.analytics.page(friendlyName, {
        ...pageProperties,
        path: window.location.pathname,
        url: window.location.href,
        title: document.title,
      })
    }
  }

  // Wait for analytics to load, then track page view on initial load
  const waitForAnalytics = (callback, maxAttempts = 50, interval = 100) => {
    let attempts = 0
    const checkAnalytics = () => {
      attempts++
      if (window.analytics && window.analytics.initialized) {
        callback()
      } else if (attempts < maxAttempts) {
        setTimeout(checkAnalytics, interval)
      }
    }
    checkAnalytics()
  }

  // Track page view on initial load once analytics is ready
  waitForAnalytics(() => {
    trackPage()
  })

  // Expose trackEvent, trackLinkEvent, and trackPage to the global scope.
  window.trackEvent = trackEvent
  window.trackLinkEvent = trackLinkEvent
  window.trackPage = trackPage
})()
