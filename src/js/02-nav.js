;(function () {
  'use strict'

  // Prevent body scrolling when the nav drawer is open.
  const drawerCheckbox = document.querySelector('#nav-drawer-input')
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
  if (drawerCheckbox && scrollbarWidth) {
    drawerCheckbox.addEventListener('change', function () {
      if (this.checked) {
        document.documentElement.style.overflow = 'hidden'
        document.documentElement.style.paddingRight = `${scrollbarWidth}px`
      } else {
        document.documentElement.style = ''
      }
    })
  }

  // Open first nav collapse if none are open.
  // Useful for pages with no nav links i.e. landing pages.
  const sideNav = document.querySelector('#side-nav')
  if (sideNav) {
    const checkedInputs = sideNav.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked')
    if (!checkedInputs.length) {
      const firstInput = sideNav.querySelector('input[type="checkbox"], input[type="radio"]')
      if (firstInput) {
        firstInput.checked = true
      }
    }
  }
})()
