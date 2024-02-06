;(function () {
  'use strict'

  document.querySelectorAll('.tabs').forEach((block) => {
    var container = block.querySelector('.tablist')
    var ulist = block.querySelector('.tablist > ul')

    // Create scroll buttons
    const scrollRightButton = document.createElement('button')
    scrollRightButton.className = 'material-icons btn btn-neutral btn-plain w-2 invisible opacity-0 transition-opacity'
    scrollRightButton.textContent = 'chevron_right'
    container.append(scrollRightButton)

    const scrollLeftButton = document.createElement('button')
    scrollLeftButton.className = 'material-icons btn btn-neutral btn-plain w-2 invisible opacity-0 transition-opacity'
    scrollLeftButton.textContent = 'chevron_left'
    container.prepend(scrollLeftButton)

    // Function to check scroll and show/hide buttons
    const checkScroll = () => {
      scrollLeftButton.classList.toggle('invisible', ulist.scrollLeft === 0)
      scrollLeftButton.classList.toggle('opacity-0', ulist.scrollLeft === 0)
      scrollRightButton.classList.toggle('invisible', ulist.scrollWidth <= (ulist.clientWidth + ulist.scrollLeft + 1))
      scrollRightButton.classList.toggle('opacity-0', ulist.scrollWidth <= (ulist.clientWidth + ulist.scrollLeft + 1))
    }

    // Check scroll initially
    checkScroll()

    // Check scroll whenever the ulist is resized
    // eslint-disable-next-line no-undef
    const resizeObserver = new ResizeObserver(checkScroll)
    resizeObserver.observe(ulist)

    // Check scroll whenever the block is scrolled
    ulist.addEventListener('scroll', checkScroll)

    // Scroll when buttons are clicked
    scrollLeftButton.addEventListener('click', () => {
      ulist.scrollLeft -= 100
    })

    scrollRightButton.addEventListener('click', () => {
      ulist.scrollLeft += 100
    })
  })
})()
