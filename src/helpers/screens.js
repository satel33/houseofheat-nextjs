import screens from '../theme/screens.cjs'

export function isDesktop (width) {
  return (width || window?.innerWidth) >= parseInt(screens.md, 10)
}
