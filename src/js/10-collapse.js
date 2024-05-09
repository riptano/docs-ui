;(function () {
  'use strict'

  const collapseFn = (trigger, collapse) => {
    const toggle = (e) => {
      e.stopPropagation()
      e.preventDefault()
      collapse.classList.toggle('active')
      trigger.classList.toggle('active')
      trigger.ariaExpanded = trigger.ariaExpanded !== 'true'
    }

    trigger.addEventListener('click', toggle)
  }

  // Init all collapses
  document.querySelectorAll('.collapse').forEach((collapse) => {
    const trigger = collapse.querySelector('.collapse-trigger')
    const content = collapse.querySelector('.collapse-content')
    collapseFn(trigger, content)
  })
})()
