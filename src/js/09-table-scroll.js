;(function () {
  'use strict'

  // A table wider than the column scrolls sideways in a box of its own, so the page doesn't. The
  // box is a div.tablecontainer, the class Asciidoctor Tabs gives the box it puts around each table
  // in a tab panel, which the table margin rules in doc.css already expect. While a table overflows
  // its box, the box is a named region that the keyboard can reach and scroll, and it fades out at
  // each edge that has more of the table behind it.
  const article = document.querySelector('article.doc')
  if (!article) return

  // A table in another table's cell scrolls with that table, and a table floated by a role keeps
  // its float. Asciidoctor lays out admonitions and horizontal description lists as tables too,
  // so only a table block counts as the table another is in. A horizontal list sizes its columns
  // to their content, though, so on screen a box in one grows with its table and the page scrolls
  // as before; in print the table fits the page.
  const tables = [...article.querySelectorAll('table.tableblock')].filter(
    (table) => !table.parentElement.closest('table.tableblock') && !table.matches('.left, .right')
  )

  // Each region is named by its table's caption, or else by the heading of the table's section, or
  // by the page title before the first section, with a number only when that heading has more than
  // one untitled table. Asciidoctor numbers only titled tables, so a name by position could echo
  // another table's caption.
  const text = (el) => el?.textContent.trim().replaceAll(/\s+/g, ' ') || ''
  const pageTitle = text(article.querySelector('h1'))
  const headingOf = (table) => {
    const section = table.closest('.sect1, .sect2, .sect3, .sect4, .sect5')
    const heading = section?.querySelector(':scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6')
    return text(heading) || pageTitle
  }
  const nameTables = () => {
    const names = new Map()
    const untitled = new Map()
    for (const table of tables) {
      const caption = text(table.querySelector(':scope > caption'))
      if (caption) {
        names.set(table, caption)
        continue
      }
      const heading = headingOf(table)
      if (!untitled.has(heading)) untitled.set(heading, [])
      untitled.get(heading).push(table)
    }
    for (const [heading, list] of untitled) {
      const where = heading ? ` in ${heading}` : ''
      list.forEach((table, i) => names.set(table, list.length > 1 ? `Table ${i + 1}${where}` : `Table${where}`))
    }
    // Should two names still match, such as a repeated caption, the later ones get a number
    const used = new Set()
    for (const table of tables) {
      const name = names.get(table)
      let unique = name
      let n = 1
      while (used.has(unique)) {
        n += 1
        unique = `${name} (${n})`
      }
      used.add(unique)
      names.set(table, unique)
    }
    return names
  }
  const names = nameTables()

  // How much of the table is out of view, and on which sides; null when it fits. A pixel of
  // overflow is rounding, not a table that needs scrolling.
  const stateOf = (box) => {
    const hidden = box.scrollWidth - box.clientWidth
    if (hidden < 2) return null
    const sides = []
    if (box.scrollLeft > 0) sides.push('left')
    if (box.scrollLeft < hidden - 1) sides.push('right')
    return { hidden, sides: sides.join(' ') }
  }

  const labels = new WeakMap()

  const apply = (box, state) => {
    if (!state) {
      if (!box.hasAttribute('tabindex')) return
      box.removeAttribute('tabindex')
      box.removeAttribute('role')
      box.removeAttribute('aria-label')
      delete box.dataset.overflow
      box.style.removeProperty('--table-hidden')
      return
    }
    if (!box.hasAttribute('tabindex')) {
      box.tabIndex = 0
      box.setAttribute('role', 'region')
      box.setAttribute('aria-label', labels.get(box))
    }
    // The fade is as wide as the hidden part, up to a limit, so a table that's a few pixels too
    // wide barely fades
    const hidden = `${state.hidden}px`
    if (box.style.getPropertyValue('--table-hidden') !== hidden) box.style.setProperty('--table-hidden', hidden)
    if (box.dataset.overflow !== state.sides) box.dataset.overflow = state.sides
  }

  // All reads first, then all writes, so a page with many tables lays out once
  // eslint-disable-next-line no-undef
  const resizeObserver = new ResizeObserver((entries) => {
    const boxes = [...new Set(entries.map((entry) => entry.target.closest('.tablecontainer')))]
    const states = boxes.map((box) => stateOf(box))
    boxes.forEach((box, i) => apply(box, states[i]))
  })

  const watch = (box) => {
    const table = box.querySelector(':scope > table')
    if (labels.has(box) || !table) return
    labels.set(box, names.get(table) || 'Table')
    box.addEventListener('scroll', () => apply(box, stateOf(box)), { passive: true })
    resizeObserver.observe(box)
    resizeObserver.observe(table)
  }

  for (const table of tables) {
    // Asciidoctor Tabs puts the tables in its panels in a box itself
    if (table.parentElement.closest('.tabpanel, .tablecontainer')) continue
    const box = document.createElement('div')
    box.className = 'tablecontainer'
    table.parentNode.insertBefore(box, table).appendChild(table)
    watch(box)
  }

  // Asciidoctor Tabs runs after this script, and before the load event
  const watchAll = () => article.querySelectorAll('.tablecontainer').forEach((box) => watch(box))
  if (document.readyState === 'complete') watchAll()
  else window.addEventListener('load', watchAll)
})()
