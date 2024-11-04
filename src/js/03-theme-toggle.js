/* eslint-disable no-undef */
;(function () {
  'use strict'

  var toggleButtons = document.querySelectorAll('#theme-toggle .toggle-button')
  if (!toggleButtons) return

  var storedTheme = localStorage.getItem('themePreference')
  var theme = storedTheme || 'system'

  var toggleThumb = document.querySelector('#theme-toggle .thumb')
  toggleThumb.classList.add(theme)

  var currentButton = document.querySelector(`#theme-toggle .toggle-button[value="${theme}"]`)
  if (currentButton) {
    currentButton.ariaPressed = 'true'
    currentButton.classList.add('active')
  }

  toggleButtons.forEach((button) => {
    button.onclick = function () {
      var systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      var currentTheme = localStorage.getItem('themePreference') || systemPreference
      if (button.value === currentTheme) return
      if (button.value === 'system') {
        document.documentElement.setAttribute('data-theme', systemPreference)
      } else {
        document.documentElement.setAttribute('data-theme', button.value)
      }
      localStorage.setItem('themePreference', button.value)
      toggleThumb.classList.remove('system', 'light', 'dark')
      toggleThumb.classList.add(button.value)
      toggleButtons.forEach((btn) => {
        btn.ariaPressed = 'false'
        btn.classList.remove('active')
      })
      button.ariaPressed = 'true'
      button.classList.add('active')
    }
  })
})()
