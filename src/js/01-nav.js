;(function () {
  'use strict'

  // Prevent body scrolling when the nav drawer is open.
  const drawerCheckbox = document.querySelector('#nav-drawer-input')
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

  const sideNav = document.querySelector('#side-nav')
  if (sideNav) {
    // Open first nav collapse if none are open.
    // Useful for pages with no nav links i.e. landing pages.
    const activeCollapses = sideNav.querySelectorAll('.collapse > .collapse-content.active')
    if (!activeCollapses.length) {
      const firstCollapse = sideNav.querySelector('.collapse > .collapse-content')
      if (firstCollapse) {
        firstCollapse.classList.add('active')
      }
    }
    // Auto scroll the side nav to the current page's side nav link
    const currentPageLink = sideNav.querySelector('.nav-link.current-page')
    if (currentPageLink) {
      currentPageLink.scrollIntoView({ block: 'center' })
    }
  }

  // Top Global Nav horizontal scrolling
  const globalNav = document.querySelector('.global-nav')
  if (globalNav) {
    const scrollLeftButton = document.createElement('button')
    scrollLeftButton.className = 'scroll-btn-left'
    const leftIcon = document.createElement('i')
    leftIcon.className = 'material-icons'
    leftIcon.textContent = 'chevron_left'
    scrollLeftButton.appendChild(leftIcon)
    globalNav.appendChild(scrollLeftButton)

    const scrollRightButton = document.createElement('button')
    scrollRightButton.className = 'scroll-btn-right'
    const rightIcon = document.createElement('i')
    rightIcon.className = 'material-icons'
    rightIcon.textContent = 'chevron_right'
    scrollRightButton.appendChild(rightIcon)
    globalNav.appendChild(scrollRightButton)

    // Function to check scroll and show/hide buttons
    const checkScroll = () => {
      scrollLeftButton.classList.toggle('active', globalNav.scrollLeft > 0)
      scrollRightButton.classList.toggle('active',
        globalNav.scrollWidth > (globalNav.clientWidth + globalNav.scrollLeft + 1))
    }

    // Check scroll initially
    checkScroll()

    // Check scroll whenever the tablist is resized
    // eslint-disable-next-line no-undef
    const resizeObserver = new ResizeObserver(checkScroll)
    resizeObserver.observe(globalNav)

    // Check scroll whenever the block is scrolled
    globalNav.addEventListener('scroll', checkScroll)

    // Scroll when buttons are clicked
    scrollLeftButton.addEventListener('click', () => {
      globalNav.scrollLeft -= 200
    })

    scrollRightButton.addEventListener('click', () => {
      globalNav.scrollLeft += 200
    })
  }
})()
