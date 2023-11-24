export function inBrowser () {
  return typeof window !== 'undefined'
}

export function getCssProp (property, defaultValue) {
  return inBrowser()
    ? window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(property)
    : defaultValue
}

export function setCssProp (property, value) {
  return inBrowser()
    ? document.documentElement.style.setProperty(property, value)
    : null
}
