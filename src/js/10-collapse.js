/**
 * Collapse Example
 *
 * <div class="collapse">
 *  <button id="collapse-button-1" class="collapse-trigger" aria-controls="collapse-content-1" >
 *    Show or Hide Content
 *  </button>
 *  <div id="collapse-content-1" class="collapse-content" aria-labelledby="collapse-button-1">
 *   <p>Collapse Content</p>
 *  </div>
 * </div>
 */

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
    trigger.ariaExpanded = false
    trigger.addEventListener('click', toggle)
  }

  // Init all collapses
  document.querySelectorAll('.collapse').forEach((collapse) => {
    const trigger = collapse.querySelector('.collapse-trigger')
    const content = collapse.querySelector('.collapse-content')
    collapseFn(trigger, content)
  })
})()
