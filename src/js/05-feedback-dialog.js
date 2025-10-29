;(function () {
  'use strict'

  const dialog = document.getElementById('feedback_dialog')
  const form = document.getElementById('feedback_form')

  if (!dialog) return

  const hide = (element) => {
    element.classList.remove('opacity-100')
    element.classList.add('opacity-0')
    setTimeout(() => {
      element.classList.add('hidden')
    }, 150)
  }

  const show = (element) => {
    element.classList.remove('opacity-0')
    element.classList.add('opacity-100')
    setTimeout(() => {
      element.classList.remove('hidden')
    }, 150)
  }

  const showThankYou = () => {
    const buttons = document.getElementById('feedback_buttons')
    const thankYou = document.getElementById('feedback_thank_you')
    hide(buttons)
    setTimeout(() => {
      show(thankYou)
    }, 150)
    setTimeout(() => {
      hide(thankYou)
      setTimeout(() => {
        show(buttons)
      }, 150)
    }, 5 * 1000)
  }

  form.onsubmit = (e) => {
    e.preventDefault()
    const message = form.elements.message.value
    if (message && window.analytics && window.getSegmentCommonProperties) {
      const commonProps = window.getSegmentCommonProperties('User Form')

      // Map to IBM User Form schema
      window.analytics.track('User Form', {
        ...commonProps,
        action: 'submitted',
        formId: 'feedback_form',
        formType: 'feedback',
        field: 'feedback_message',
        fieldType: 'text_field',
        title: 'Give Feedback',
        data: message,
      })
    }
    form.elements.message.value = ''
    dialog.close()
    showThankYou()
  }

  const feedbackButtonYes = document.getElementById('feedback_button_yes')
  feedbackButtonYes.addEventListener('click', (e) => {
    if (window.analytics && window.getSegmentCommonProperties) {
      const commonProps = window.getSegmentCommonProperties('User Form')

      // Track positive feedback button click
      window.analytics.track('User Form', {
        ...commonProps,
        action: 'clicked',
        formId: 'feedback_buttons',
        formType: 'feedback',
        field: 'helpful_yes',
        fieldType: 'button',
        title: 'Was This Helpful?',
      })
    }
    showThankYou()
  })

  const cancelButton = document.getElementById('feedback_form_cancel_button')
  cancelButton.addEventListener('click', (e) => {
    form.elements.message.value = ''
  })

  const escButton = document.getElementById('feedback_form_esc_button')
  escButton.addEventListener('click', (e) => {
    form.elements.message.value = ''
  })

  // if ESC pressed
  dialog.addEventListener('cancel', (e) => {
    form.elements.message.value = ''
    showThankYou()
  })
})()
