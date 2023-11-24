import cn from 'clsx'
import gsap from 'gsap'
import Draggable from 'gsap/dist/Draggable'
import padStart from 'lodash/padStart'
import range from 'lodash/range'
import throttle from 'lodash/throttle'
import { useCallback, useEffect, useRef } from 'react'
import { useWindowSize } from 'react-use'
import { isDesktop } from '../../helpers/screens'
import CaretIcon from '../../icons/caret.svg'
import Mono from '../Typography/Mono'

const labelCount = 17

export default function RatingSlider ({
  value,
  onValueChanged,
  onDragStart,
  onDragEnd,
  onSliderClicked
}) {
  const sliderRef = useRef()
  const containerRef = useRef()
  const labelRef = useRef()
  const sliderClickAreaRef = useRef()
  const localsRef = useRef({ value, draggable: null, disableClick: false })
  localsRef.current.value = value

  const { width } = useWindowSize()
  const direction = !isDesktop(width) ? 'y' : 'x'

  const updateValueThrottle = useCallback(throttle(onValueChanged, 10), [
    onValueChanged
  ])

  const updateSliderPosition = ({
    value,
    draggable,
    direction,
    updateBounds
  }) => {
    // const { draggable, value } = localsRef.current
    if (updateBounds) {
      draggable.update(true)
    }
    const min = draggable[`min${direction.toUpperCase()}`]
    const max = draggable[`max${direction.toUpperCase()}`]
    // We invert the values so that it starts at 100 at the top on mobile
    gsap.set(sliderRef.current, {
      [direction]: gsap.utils.interpolate(
        direction === 'x' ? min : max,
        direction === 'x' ? max : min,
        value
      ),
      [direction === 'x' ? 'y' : 'x']: 0
    })
  }

  useEffect(() => {
    // This will not work on the server side
    gsap.registerPlugin(Draggable)

    const [draggable] = Draggable.create(sliderRef.current, {
      type: direction,
      edgeResistance: 1,
      bounds: containerRef.current,
      onDrag: () => {
        const min = draggable[`min${direction.toUpperCase()}`]
        const max = draggable[`max${direction.toUpperCase()}`]
        // We invert the values so that it starts at 100 at the top on mobile
        const normalizedX = gsap.utils.normalize(
          direction === 'x' ? min : max,
          direction === 'x' ? max : min,
          draggable[direction]
        )
        updateValueThrottle(normalizedX)
      },
      onDragEnd,
      onDragStart
    })
    localsRef.current.draggable = draggable
    updateSliderPosition({
      ...localsRef.current,
      updateBounds: true,
      direction
    })
    return () => draggable.kill()
  }, [updateValueThrottle, direction])

  useEffect(() => {
    // When the width changes we need to update the slider position as we are moving it using pixels using gsap draggable
    updateSliderPosition({
      ...localsRef.current,
      updateBounds: true,
      direction
    })
  }, [width, direction])

  useEffect(() => {
    if (labelRef.current) {
      if (isDesktop(width)) {
        // This will adjust the size of the label on desktop as we move the slider around
        const x = `-${gsap.utils.interpolate([100, 50, 350], value)}%`
        gsap.to(labelRef.current, {
          scale: 2 + 8 * value,
          x,
          y: -60 * (value + 0.2),
          duration: 0.1,
          ease: 'sine.out'
        })
      } else {
        gsap.set(labelRef.current, { clearProps: 'scale,x,y' })
      }
      updateSliderPosition({ ...localsRef.current, direction })
    }
  }, [direction, value])

  const onSliderClick = useCallback(
    e => {
      if (localsRef.current.disableClick) return
      localsRef.current.disableClick = true
      const {
        width,
        height,
        left,
        top
      } = sliderClickAreaRef.current.getBoundingClientRect()

      let target = 0
      if (isDesktop()) {
        const x = e.clientX - left
        target = x / width
      } else {
        const y = e.clientY - top
        target = 1 - y / height
      }
      const animation = { value: localsRef.current.value }
      gsap.to(animation, {
        value: target,
        duration: 0.15,
        ease: 'sine.inOut',
        onUpdate: () => {
          updateSliderPosition({
            draggable: localsRef.current.draggable,
            value: animation.value,
            direction
          })
        },
        onComplete: () => {
          onValueChanged(animation.value)
          localsRef.current.disableClick = false
        }
      })
      if (onSliderClicked) onSliderClicked()
    },
    [onValueChanged, onSliderClicked, direction]
  )

  return (
    <div
      className='absolute inset-0 flex justify-center items-center m-4 md:m-6'
      ref={containerRef}
    >
      <div className='absolute w-full h-full flex items-center justify-between flex-col md:flex-row select-none'>
        {range(labelCount).map((_, i) => (
          <Mono key={i}>H°</Mono>
        ))}
      </div>
      <div
        onMouseDown={onSliderClick}
        className='absolute left-auto md:left-0 top-0 md:top-auto w-12 md:w-full h-full md:h-12 cursor-pointer'
        ref={sliderClickAreaRef}
      />
      {value !== null && (
        <div
          className='absolute bg-white px-3 py-6 md:px-6 md:py-4 rounded-full text-black cursor-grab'
          ref={sliderRef}
        >
          <span
            className={cn(
              'absolute text-[3rem] xs:text-[4rem] top-1/2 md:text-md left-full md:left-1/2 md:top-auto md:bottom-full',
              'text-white translate-x-2 -translate-y-1/2 md:-translate-x-1/2 md:-translate-y-2 font-bold select-none'
            )}
            ref={labelRef}
          >
            {padStart(Math.max(1, Math.round(value * 100)).toString(), 2, '0')}°
          </span>
          <Mono className='select-none flex items-center flex-col md:flex-row '>
            <CaretIcon className='-rotate-90 md:rotate-180 w-2' />
            <span className='block mx-0 my-2 md:mx-2 md:my-0'>Drag</span>
            <CaretIcon className='rotate-90 w-2 md:rotate-0' />
          </Mono>
        </div>
      )}
    </div>
  )
}
