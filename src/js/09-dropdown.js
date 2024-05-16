/**
 * Dropdown Example
 *
 * Optional: data-trigger-type="hover" (default is "click")
 * Optional: data-placement="right-start" (default is "bottom-start")
 * Valid Placement Options:
 * top, top-start, top-end,
 * right, right-start, right-end,
 * bottom, bottom-start, bottom-end,
 * left, left-start, left-end
 *
 * <div class="dropdown" data-trigger-type="hover" data-placement="bottom-start">
 *  <button id="dropdown-1" class="dropdown-trigger" aria-haspopup="true">
 *    Show or Hide Content
 *  </button>
 *  <ul class="dropdown-content" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-1">
 *    <li role="menuitem"><a href="#">Dropdown Item 1</a></li>
 *    <li role="menuitem"><a href="#">Dropdown Item 2</a></li>
 *  </ul>
 * </div>
 */

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

  const dropdownFn = (trigger, dropdown, triggerType = 'click', placement) => {
    const update = () => {
      computePosition(trigger, dropdown, {
        strategy: 'fixed',
        middleware: [
          autoPlacement(
            {
              alignment: 'start',
              allowedPlacements: placement ? [placement] : ['bottom', 'bottom-start', 'bottom-end'],
            }
          ),
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

    trigger.ariaExpanded = false

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
    const placement = dropdown.dataset.placement
    const trigger = dropdown.querySelector('.dropdown-trigger')
    const content = dropdown.querySelector('.dropdown-content')
    dropdownFn(trigger, content, triggerType, placement)
  })
})()
