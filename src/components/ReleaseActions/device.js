export const isBrowser = () => {
  if (typeof window === 'undefined') {
    return false
  } else {
    return true
  }
}
// iOS
export const isiOS = isBrowser()
  ? () => {
      if ((/iPad|iPhone|iPod/i.test(navigator.userAgent || navigator.vendor || window.opera) && !window.MSStream) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
        return true
      } else {
        return false
      }
    }
  : () => {
      return false
    }
// Android
export const isAndroid = isBrowser()
  ? () => {
      if (/android/i.test(navigator.userAgent || navigator.vendor || window.opera) && !window.MSStream) {
        return true
      } else {
        return false
      }
    }
  : () => {
      return false
    }
// Chrome
export const isChrome = isBrowser()
  ? () => {
      if (/chrome|chromium|crios|google inc/i.test(navigator.userAgent || navigator.vendor)) {
        return true
      } else {
        return false
      }
    }
  : () => {
      return false
    }
