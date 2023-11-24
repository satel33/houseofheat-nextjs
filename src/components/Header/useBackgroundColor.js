import get from 'lodash/get'
import { useEffect, useRef, useState } from 'react'
import Color from 'tinycolor2'

import {
  getForegroundColorFromBackgroundColor,
  getImageDominateColor,
  isColorDark
} from '../../helpers/colors'
import colors from '../../theme/colors.cjs'

const getColors = (toolbar, page, darken) => {
  if (page.pageType === 'release' || page._type === 'release') {
    const imageBackgroundColor = getImageDominateColor(
      get(page, ['featuredImages', 0])
    )
    const pageColor = Color(
      page.pageTheme || imageBackgroundColor || colors.defaultPageTheme
    )
      .darken(darken ? 10 : 0)
      .toHexString()
    return {
      backgroundColor: {
        from: pageColor,
        to: pageColor
      },
      foregroundColor: getForegroundColorFromBackgroundColor(pageColor),
      light: isColorDark(pageColor)
    }
  }
  return {
    backgroundColor: toolbar.gradient,
    foregroundColor: colors.black,
    light: false
  }
}

const useBackgroundColor = (toolbar, page, darken = false) => {
  const [colors, setColors] = useState(getColors(toolbar, page))
  const initialColors = useRef(colors)
  useEffect(() => {
    setColors(getColors(toolbar, page, darken))
  }, [toolbar, page, darken])
  return {
    ...colors,
    initialColors
  }
}

export default useBackgroundColor
