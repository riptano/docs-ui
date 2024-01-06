;(function () {
  'use strict'

  const drawerCheckbox = document.querySelector('#nav-drawer')
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
})()
