/* eslint-disable no-undef */
var toggle = document.getElementById('theme-toggle')

var prefersTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
var storedTheme = localStorage.getItem('theme') || prefersTheme

toggle.onclick = function () {
  var currentTheme = document.documentElement.getAttribute('data-theme') || storedTheme || 'light'
  var targetTheme = 'light'

  if (currentTheme === 'light') {
    targetTheme = 'dark'
  }

  document.documentElement.setAttribute('data-theme', targetTheme)
  localStorage.setItem('theme', targetTheme)
}
