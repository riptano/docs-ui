/* eslint-disable no-undef */
var toggle = document.getElementById('theme-toggle')

function setIcon (theme) {
  if (theme === 'dark') {
    toggle.innerHTML = '<span class="material-icons">light_mode</span>'
  } else {
    toggle.innerHTML = '<span class="material-icons">dark_mode</span>'
  }
}

var storedTheme = localStorage.getItem('theme')
var prefersTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

if (storedTheme) {
  document.documentElement.setAttribute('data-theme', storedTheme)
  setIcon(storedTheme)
} else {
  setIcon(prefersTheme)
}

toggle.onclick = function () {
  var currentTheme = document.documentElement.getAttribute('data-theme') || prefersTheme
  var targetTheme = 'light'

  if (currentTheme === 'light') {
    targetTheme = 'dark'
  }

  document.documentElement.setAttribute('data-theme', targetTheme)
  localStorage.setItem('theme', targetTheme)
  setIcon(targetTheme)
}
