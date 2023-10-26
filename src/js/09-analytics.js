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

  const survey = document.querySelector('.dialog-action--container')

  if (!survey) return

  const surveyElements = survey.querySelectorAll('button')
  const response = document.createElement('p')

  response.className = 'dialog-action--response'
  response.innerText = 'Thank you for your Feedback!'
  survey.appendChild(response)

  const dialog = document.getElementById('dialog-survey')
  // if ESC pressed
  dialog.addEventListener('cancel', (event) => {
    hideButtons(surveyElements)
  })
  // close dialog
  const close = dialog.querySelectorAll('button.close')
  close.forEach((s) => {
    s.onclick = function (e) {
      dialog.close()
      hideButtons(surveyElements)
    }
  })

  surveyElements.forEach((element) => {
    element.addEventListener('click', (e) => {
      styleButton(element)
      window.analytics.track(element.dataset.survey)

      if (element.id.includes('no')) {
        // open dialog
        dialog.showModal()
        // submit form
        const form = document.getElementById('survey-form')
        form.elements.message.required = true
        form.elements.message.value = ''
        form.onsubmit = (e) => {
          e.preventDefault()
          const message = form.elements.message.value
          window.analytics.trackForm(form, 'Support Survey', {
            message: message,
          })
          dialog.close()
          hideButtons()
        }
      } else {
        hideButtons()
      }
    })
  })

  function hideButtons () {
    survey.classList.add('dialog-action--animate', 'first-time')
    setTimeout(function () {
      survey.classList.remove('first-time')
      survey.classList.remove('dialog-action--animate')
      surveyElements.forEach((s) => {
        s.classList.remove('ds-button--variant-solid')
      })
    }, 3.5 * 1000)
  }

  function styleButton (el) {
    el.classList.add('ds-button--variant-solid')
  }
})()
