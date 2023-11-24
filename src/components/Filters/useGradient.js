import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import forEach from 'lodash/forEach'

import colors from '../../theme/colors.cjs'
import { useWindowResize } from '../../hooks/useWindowResize'
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback'

const useGradient = (
  enabled,
  ids,
  fromColor = colors.lime[300],
  toColor = colors.cyan[400]
) => {
  const containerRef = useRef()

  const createGradientEffect = useCallback(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const btn = container?.parentElement?.querySelector('[data-filters-button]')

    // Disabled/Closed: Reset btn colors
    if (!enabled && btn) {
      btn.style.borderColor = colors.black
      btn.style.backgroundColor = 'transparent'
      return
    }

    // Enabled/Open: Apply the gradient colors to the filters
    if (enabled) {
      const { height: containerHeight } = container.getBoundingClientRect()
      const children = container.querySelectorAll('[data-filter-id]')

      // Change the btn colors
      if (btn) {
        btn.style.borderColor = fromColor
        btn.style.backgroundColor = fromColor
      }

      // Apply the gradient colors to the items
      forEach(children, child => {
        const isSelected = ids.includes(child.dataset.filterId)
        const { height } = child.getBoundingClientRect()
        const top = child.offsetTop
        const bottom = top + height
        const topColor = gsap.utils.interpolate(
          fromColor,
          toColor,
          top / containerHeight
        )
        const bottomColor = gsap.utils.interpolate(
          fromColor,
          toColor,
          bottom / containerHeight
        )

        child.style.backgroundImage = isSelected
          ? `linear-gradient(${topColor}, ${bottomColor})`
          : 'none'
      })
    }
  }, [enabled, ids, fromColor, toColor])

  useEffect(createGradientEffect, [createGradientEffect])
  useWindowResize(
    useDebouncedCallback(createGradientEffect, 200, [createGradientEffect])
  )

  return containerRef
}

export default useGradient
