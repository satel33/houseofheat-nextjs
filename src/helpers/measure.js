export function getAbsoluteWidth (el) {
  if (!el) return 0
  const styles = window.getComputedStyle(el)
  const margin = parseFloat(styles.marginLeft) +
               parseFloat(styles.marginRight)
               
  return Math.ceil(el.offsetWidth + margin)
}
