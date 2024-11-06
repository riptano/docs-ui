/* eslint-disable no-undef */
;(function () {
  'use strict'

  const toggleButtons = document.querySelectorAll('#theme-toggle .toggle-button')

  const handleThemeChange = (theme) => {
    if (theme === 'system') {
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', systemPreference)
      document.documentElement.setAttribute('data-theme-system', true)
      localStorage.removeItem('themePreference')
    } else {
      document.documentElement.setAttribute('data-theme', theme)
      document.documentElement.removeAttribute('data-theme-system')
      localStorage.setItem('themePreference', theme)
    }
    applyButtonAria(theme)
  }

  const applyButtonAria = (theme) => {
    const newButton = document.querySelector(`#theme-toggle .toggle-button[value="${theme}"]`)
    toggleButtons.forEach((btn) => {
      btn.setAttribute('aria-pressed', btn === newButton)
    })
  }

  applyButtonAria(localStorage.getItem('themePreference') || 'system')

  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme')
      const isSystemTheme = document.documentElement.hasAttribute('data-theme-system')
      if ((button.value === currentTheme && !isSystemTheme) || (button.value === 'system' && isSystemTheme)) return
      handleThemeChange(button.value)
    })
  })

  // Observe system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (document.documentElement.hasAttribute('data-theme-system')) {
      handleThemeChange('system')
    }
  })
})()
