'use strict'

module.exports = module.exports = (navItem, {
  data: {
    root: { page },
  },
}) => {
  if (navItem.component) return navItem.component === page.component?.name
  if (navItem.items) return navItem.items.some((item) => item.component && item.component === page.component?.name)
  return false
}
