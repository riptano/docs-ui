;(function () {
  'use strict'

  const { computePosition, autoPlacement, shift } = window.FloatingUIDOM
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches

  const hideAllDropdowns = () => {
    document.querySelectorAll('.dropdown').forEach((dropdown) => {
      dropdown.querySelector('.dropdown-trigger').classList.remove('active')
      dropdown.querySelector('.dropdown-content').classList.remove('active')
    })
  }

  const dropdownFn = (trigger, dropdown, triggerType = 'click') => {
    const update = () => {
      computePosition(trigger, dropdown, {
        strategy: 'fixed',
        middleware: [
          autoPlacement({ alignment: 'start', allowedPlacements: ['bottom', 'bottom-start', 'bottom-end'] }),
          shift(),
        ],
      }).then(({ x, y }) => {
        dropdown.style.left = `${x}px`
        dropdown.style.top = `${y}px`
      })
    }

    const show = () => {
      hideAllDropdowns()
      dropdown.classList.add('active')
      trigger.classList.add('active')
      trigger.ariaExpanded = true
      update()
    }

    const hide = () => {
      dropdown.classList.remove('active')
      trigger.classList.remove('active')
      trigger.ariaExpanded = false
    }

    let hideTimeoutId = null

    const hideTimeout = () => {
      hideTimeoutId = setTimeout(hide, 400)
    }

    const clearHideTimeout = () => {
      clearTimeout(hideTimeoutId)
    }

    const toggle = () => {
      dropdown.classList.toggle('active')
      trigger.classList.toggle('active')
      trigger.ariaExpanded = trigger.ariaExpanded !== 'true'
      update()
    }

    const clickOutside = (event) => {
      if (event.target !== trigger && !trigger.contains(event.target)) {
        hide()
      }
    }

    const blur = (event) => {
      if (event.target !== dropdown && !dropdown.contains(event.target)) {
        hide()
      }
    }

    if (triggerType === 'hover' && !isTouchDevice) {
      trigger.addEventListener('mouseenter', show)
      trigger.addEventListener('mouseenter', clearHideTimeout)
      trigger.addEventListener('mouseleave', hideTimeout)
      dropdown.addEventListener('mouseenter', clearHideTimeout)
      dropdown.addEventListener('mouseleave', hideTimeout)
    }

    trigger.addEventListener('click', toggle)
    document.body.addEventListener('click', clickOutside)
    dropdown.addEventListener('blur', blur)
  }

  // Init all dropdowns
  document.querySelectorAll('.dropdown').forEach((dropdown) => {
    const triggerType = dropdown.dataset.triggerType
    const trigger = dropdown.querySelector('.dropdown-trigger')
    const content = dropdown.querySelector('.dropdown-content')
    dropdownFn(trigger, content, triggerType)
  })
})()
