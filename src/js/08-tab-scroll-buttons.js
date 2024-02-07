;(function () {
  'use strict'

  document.querySelectorAll('.tabs').forEach((block) => {
    const tablist = block.querySelector('.tablist')
    const ulist = tablist.querySelector('.tablist > ul')

    // Create scroll buttons
    const scrollLeftButton = document.createElement('button')
    scrollLeftButton.className = 'scroll-btn-left'
    const leftIcon = document.createElement('i')
    leftIcon.className = 'material-icons'
    leftIcon.textContent = 'chevron_left'
    scrollLeftButton.appendChild(leftIcon)
    tablist.appendChild(scrollLeftButton)

    const scrollRightButton = document.createElement('button')
    scrollRightButton.className = 'scroll-btn-right'
    const rightIcon = document.createElement('i')
    rightIcon.className = 'material-icons'
    rightIcon.textContent = 'chevron_right'
    scrollRightButton.appendChild(rightIcon)
    tablist.appendChild(scrollRightButton)

    // Function to check scroll and show/hide buttons
    const checkScroll = () => {
      scrollLeftButton.classList.toggle('active', ulist.scrollLeft > 0)
      scrollRightButton.classList.toggle('active', ulist.scrollWidth > (ulist.clientWidth + ulist.scrollLeft + 1))
    }

    // Check scroll initially
    checkScroll()

    // Check scroll whenever the tablist is resized
    // eslint-disable-next-line no-undef
    const resizeObserver = new ResizeObserver(checkScroll)
    resizeObserver.observe(ulist)

    // Check scroll whenever the block is scrolled
    ulist.addEventListener('scroll', checkScroll)

    // Scroll when buttons are clicked
    scrollLeftButton.addEventListener('click', () => {
      ulist.scrollLeft -= 200
    })

    scrollRightButton.addEventListener('click', () => {
      ulist.scrollLeft += 200
    })
  })
})()
