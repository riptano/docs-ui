;(function () {
  'use strict'

  if (!window.analytics) return

  const trackedLinkElements = document.querySelectorAll('a[data-track]')
  const trackedElements = document.querySelectorAll('[data-track]:not(a)')

  trackedLinkElements.forEach((element) => {
    window.analytics.trackLink(element, element.dataset.track)
  })

  trackedElements.forEach((element) => {
    element.addEventListener('click', (e) => {
      window.analytics.track(element.dataset.track)
    })
  })

  const surveyElements = document.querySelectorAll('.survey button[data-survey]')

  function hideButtons (s) {
    const parent = s.parentElement
    const parentContainer = parent.parentElement
    const message = document.createElement('p')
    message.innerText = 'Thank you for your Feedback!'
    parent.style.display = 'none'
    parentContainer.appendChild(message)
  }

  surveyElements.forEach((element) => {
    element.addEventListener('click', (e) => {
      if (element.id.includes('no')) {
        window.analytics.track(element.dataset.survey)
        // open dialog
        const dialog = document.getElementById('dialog-survey')
        dialog.showModal()
        // close dialog
        const close = dialog.querySelectorAll('button.close')
        close.forEach((s) => {
          s.onclick = function (e) {
            dialog.close()
          }
        })
        // submit form
        const form = document.getElementById('survey-form')
        form.onsubmit = (e) => {
          e.preventDefault()
          const message = form.elements[0].value
          window.analytics.trackForm(form, 'Support Survey', {
            message: message,
          })
          dialog.close()
        }
        hideButtons(element)
      } else {
        window.analytics.track(element.dataset.survey)
        hideButtons(element)
      }
    })
  })
})()
