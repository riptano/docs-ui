;(function () {
  'use strict'

  const { computePosition, autoPlacement } = window.FloatingUIDOM
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches

  const dropdownFn = (trigger, dropdown, triggerType = 'click') => {
    const update = () => {
      computePosition(trigger, dropdown, {
        strategy: 'fixed',
        middleware: [
          autoPlacement({ alignment: 'start', allowedPlacements: ['bottom', 'bottom-start', 'bottom-end'] }),
        ],
      }).then(({ x, y }) => {
        dropdown.style.left = `${x}px`
        dropdown.style.top = `${y}px`
      })
    }

    const show = () => {
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
      [
        ['mouseenter', show],
        ['mouseleave', hide],
      ].forEach(([event, listener]) => {
        trigger.addEventListener(event, listener)
        dropdown.addEventListener(event, listener)
      })
    }

    trigger.addEventListener('click', toggle)
    document.body.addEventListener('click', clickOutside)
    dropdown.addEventListener('blur', blur)
  }

  document.querySelectorAll('.dropdown').forEach((dropdown) => {
    const triggerType = dropdown.dataset.triggerType
    const trigger = dropdown.querySelector('.dropdown-trigger')
    const content = dropdown.querySelector('.dropdown-content')
    dropdownFn(trigger, content, triggerType)
  })
})()
