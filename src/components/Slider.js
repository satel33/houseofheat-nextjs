import cn from 'clsx'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import defer from 'lodash/defer'
import React, { forwardRef, useCallback, useRef } from 'react'
import useComposeRefs from '../hooks/useComposeRefs'
import { useDragCursor } from './Cursor'

const Slider = forwardRef(
  ({ className, children, loop = true, cursorSize, ...rest }, ref) => {
    const localsRef = useRef({ dragged: false })
    const [sliderElementRef, instanceRef] = useKeenSlider(
      {
        loop
      },
      [
        slider => {
          slider.on('dragged', () => {
            localsRef.current.dragged = true
          })
          slider.on('dragEnded', () => {
            defer(() => {
              localsRef.current.dragged = false
            })
          })

          slider.on('created', () => {
            if (ref) {
              ref.current = instanceRef.current
            }
            const onMouseMove = event => {
              if (localsRef.current.dragged) {
                const dragMoveEvent = new window.CustomEvent(
                  'keenslider_mousemove',
                  { detail: event }
                )
                window.dispatchEvent(dragMoveEvent)
              }
            }
            slider.container.addEventListener('mousemove', onMouseMove, {
              passive: true
            })
          })
        }
      ]
    )

    if (ref) {
      ref.current = instanceRef.current
    }

    const onElementClick = useCallback((e, onClick) => {
      if (localsRef.current.dragged) {
        e.preventDefault()
      } else {
        if (onClick) onClick(e)
      }
    }, [])

    const clonedElements = React.Children.map(children, child =>
      React.cloneElement(child, {
        className: cn(child.props.className, 'keen-slider__slide'),
        onClick: e => {
          onElementClick(e, child.props.onClick)
        }
      })
    )

    const cursorElementRef = useDragCursor(cursorSize || 1)

    const composedRefs = useComposeRefs(cursorElementRef, sliderElementRef)

    return (
      <div
        className={cn(
          className,
          'slider outline-none select-none whitespace-nowrap flex relative overflow-hidden cursor-none'
        )}
        style={{ tapHighlightColor: 'transparent' }}
        ref={composedRefs}
        {...rest}
      >
        {clonedElements}
      </div>
    )
  }
)

export default Slider
