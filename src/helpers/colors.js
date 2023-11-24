import get from 'lodash/get'
import Color from 'tinycolor2'

import colors from '../theme/colors.cjs'

export function getForegroundColorFromBackgroundColor (bgColor) {
  return isColorDark(bgColor) ? colors.white : colors.black
}

export function getForegroundColorFromImage (image) {
  const dominantColor = get(image, [
    'asset',
    'metadata',
    'palette',
    'dominant',
    'background'
  ])
  return getForegroundColorFromBackgroundColor(dominantColor)
}

export function isImageDark (image) {
  const dominantColor = getImageDominateColor(image)
  return isColorDark(dominantColor)
}

export function getImageDominateColor (image) {
  return get(image, ['asset', 'metadata', 'palette', 'dominant', 'background'])
}

export function isColorDark (bgColor) {
  if (!bgColor) return false
  return Color(bgColor).isDark()
}

export function showBorder (bgColor) {
  if (!bgColor) return true
  return Color(bgColor).getLuminance() > 0.95
}
