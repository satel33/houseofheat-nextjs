import cn from 'clsx'
import gsap from 'gsap'
import range from 'lodash/range'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { useResizeDetector } from 'react-resize-detector'
import { getAbsoluteWidth } from '../helpers/measure'

export default function Ticker ({
  className,
  animate = true,
  pxPerSecond = 100,
  children
}) {
  const [duplicates, setDuplicates] = useState(1)
  const localsRef = useRef({ textWidth: 0, x: 0 })

  const child = React.Children.only(children)
  const { width, ref } = useResizeDetector()

  useEffect(() => {
    if (ref.current) {
      // Get the parent width
      const containerWidth = ref.current.offsetWidth

      // Get the text width
      localsRef.current.textWidth = getAbsoluteWidth(ref.current.children[0])

      // Number of duplicates to always see at least two copies of the text
      const times =
        Math.ceil(containerWidth / localsRef.current.textWidth) + 1 ?? 2
      setDuplicates(times)
    }
  }, [width])

  useEffect(() => {
    if (animate) {
      const loop = (time, deltaTime) => {
        const { textWidth } = localsRef.current
        if (ref.current && textWidth > 0) {
          const seconds = deltaTime / 1000
          const pixelsToMove = pxPerSecond * seconds
          localsRef.current.x += pixelsToMove
          localsRef.current.x = localsRef.current.x % textWidth
          ref.current.style.transform = `translate3d(-${localsRef.current.x}px, 0, 0)`
        }
      }
      gsap.ticker.add(loop)
      return () => {
        gsap.ticker.remove(loop)
      }
    }
  }, [pxPerSecond, animate])

  const items = useMemo(() => {
    return range(duplicates).map(index =>
      React.cloneElement(child, {
        ...child.props,
        className: cn(child.props.className, 'shrink-0'),
        key: index,
        'aria-hidden': index > 0
      })
    )
  }, [child, duplicates])

  return (
    <div className={cn(className, 'flex flex-nowrap')} ref={ref}>
      {items}
    </div>
  )
}
