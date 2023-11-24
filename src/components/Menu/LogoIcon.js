import cn from 'clsx'
import gsap from 'gsap'
import { useAtom } from 'jotai'
import reverse from 'lodash/reverse'
import toArray from 'lodash/toArray'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import useComposeRefs from '../../hooks/useComposeRefs.js'
import { useIsHomepage } from '../../hooks/useIsHomepage.js'

import { useResizeDetector } from 'react-resize-detector'
import { headerState } from './headerState'

export default function LogoIcon () {
  const router = useRouter()
  const ref = useRef()
  const containerRef = useRef()
  const hRef = useRef()
  const dotRef = useRef()
  const lettersRef = useRef()
  const isHomepage = useIsHomepage()
  const measureRef = useRef()
  const localsRef = useRef({ containerWidth: 0 })

  const [{ expanded, large }] = useAtom(headerState)

  const onClick = useCallback(() => {
    if (isHomepage) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      router.push('/', null, { scroll: false })
    }
  }, [router])

  localsRef.current.large = large

  const onResize = useCallback(() => {
    if (!ref.current) return
    localsRef.current.containerWidth = containerRef.current.offsetWidth
    localsRef.current.smallWidth = measureRef.current.offsetWidth
  }, [])

  const { ref: resizeRef } = useResizeDetector({
    handleHeight: false,
    refreshMode: 'throttle',
    refreshOptions: { leading: false, trailing: true },
    refreshRate: 500,
    onResize
  })

  useEffect(onResize, [onResize])

  useEffect(() => {
    if (!ref.current) return

    let targetScale = 1
    const { containerWidth, smallWidth } = localsRef.current

    if (large) {
      targetScale = 1
    } else {
      targetScale = smallWidth / containerWidth
    }

    const currentWidth = ref.current.getBoundingClientRect().width
    gsap.set(ref.current, { width: '100%', scale: currentWidth / containerWidth })

    const tl = gsap.timeline()
    tl.to(ref.current, {
      duration: large ? 0.8 : 0.6,
      ease: large ? 'power4.inOut' : 'power4.out',
      scale: targetScale,
      y: '-50%',
      onComplete: () => {
        if (large) {
          gsap.set(ref.current, { width: '100%', scale: 1 })
        } else {
          gsap.set(ref.current, { width: smallWidth, scale: 1 })
        }
      }
    })

    return () => tl.kill()
  }, [large])

  useEffect(() => {
    if (!ref.current) return

    const tl = gsap.timeline()

    const arrayLetters = toArray(lettersRef.current.children)
    const letters = expanded ? arrayLetters : reverse(arrayLetters)

    tl.to(
      letters,
      {
        opacity: expanded ? 1 : 0,
        duration: expanded ? 0.4 : 0.2,
        ease: expanded ? 'expo.inOut' : 'expo.out',
        stagger: 0.04
      },
      expanded ? 0.25 : 0,
      0
    )

    tl.to(
      dotRef.current,
      {
        x: expanded ? 0 : -1118,
        duration: expanded ? 1 : 0.5,
        ease: expanded ? 'power4.inOut' : 'expo.out'
      },
      expanded ? 0 : 0.25
    )

    return () => tl.kill()
  }, [expanded])

  const initialStyles = useMemo(() => {
    const styles = { fill: 'var(--foreground)' }
    if (large) {
      return { ...styles, scale: 1, width: '100%' }
    }
    return styles
  }, [])

  const composedRefs = useComposeRefs(containerRef, resizeRef)

  return (
    <>
      <div ref={composedRefs} className='max-w-md md:max-w-none'>
        <div className='w-60' ref={measureRef} />
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 1322.1 166.8'
          id='logo'
          className={cn(
            'absolute w-full max-w-md md:max-w-none cursor-pointer pointer-events-none origin-left -translate-y-1/2',
            expanded ? 'pointer-events-auto' : 'pointer-events-none',
            large ? 'w-full' : 'md:w-60'
          )}
          ref={ref}
          onClick={expanded ? onClick : null}
          style={initialStyles}
        >
          <g className='relative'>
            <rect
              fill='transparent'
              className='pointer-events-auto absolute inset-0'
              onClick={onClick}
              width={127.5}
              height={147.2}
              y={16}
            />
            <path
              ref={hRef}
              d='M32.1,163.1v-62.4h63.3v62.4h32.1V16H95.4v58.2H32.1V16H0v147.2H32.1z'
            />
          </g>
          <g ref={lettersRef}>
            <g>
              <path
                d='M191.3,166.5c32.3,0,55.5-21.7,55.5-55.9c0-33.6-23.2-55.7-55.5-55.7c-32.3,0-55.5,22.1-55.5,55.7
          C135.8,142.9,159,166.5,191.3,166.5z M191.3,142.7c-14.4,0-24.3-10.1-24.3-31.7c0-21.7,9.9-32.6,24.3-32.6
          c14.4,0,24.3,10.9,24.3,32.6C215.6,132.6,205.7,142.7,191.3,142.7z'
              />
            </g>
            <g>
              <path
                d='M287.7,166.5c17.5,0,28.3-12.6,33.3-27.5h12.9c-5.7,8.2-9.9,17-10.1,24.2h27.9V58h-30v51.9c0,17.4-5.7,31.7-21.1,31.7
          c-9.8,0-15.8-5.7-15.8-19.8V58h-30v70.8C254.8,151.8,267.7,166.5,287.7,166.5z'
              />
            </g>
            <path
              d='M407.8,166.1c30.8,0,49-13.7,49-34.7c0-20-16.5-29-36.3-32.8l-14.6-2.7c-11.4-2.1-14.6-4.8-14.6-10.3
        c0-5.7,4.9-10.1,15-10.1c10.6,0,18.1,6.1,21.3,14.7L452.3,79c-4.6-10.5-18.2-24.2-44.5-24.2c-28.3,0-45.4,13.2-45.4,33.2
        c0,20.6,12.9,28,35,32.4l15,2.9c10.8,2.1,13.1,6.3,13.1,11.1c0,5.9-5.5,10.5-16,10.5c-20.5,0-23.6-15.3-24.1-17.7l-27.2,8.6
        C362.6,154.5,382.9,166.1,407.8,166.1z'
            />
            <path
              d='M514,166.5c32.1,0,45.4-17.2,51.3-30.7l-26.8-10.3c-4.4,9.9-11,18.3-24.5,18.3c-12.9,0-22.8-7.6-23.6-26.1h74.5
        c3-35.1-15.6-62.9-51.1-62.9c-30.6,0-53.4,22.5-53.4,55.5C460.4,144.8,481.5,166.5,514,166.5z M491.4,96.7
        c2.1-13.2,10.3-20.4,22.4-20.4c12.7,0,20.3,7.4,21.5,20.4H491.4z'
            />
            <path
              d='M658.8,166.5c32.3,0,55.5-21.7,55.5-55.9c0-33.6-23.2-55.7-55.5-55.7c-32.3,0-55.5,22.1-55.5,55.7
        C603.3,142.9,626.5,166.5,658.8,166.5z M658.8,142.7c-14.4,0-24.3-10.1-24.3-31.7c0-21.7,9.9-32.6,24.3-32.6
        c14.4,0,24.3,10.9,24.3,32.6C683.1,132.6,673.2,142.7,658.8,142.7z'
            />
            <path
              d='M764.1,80.7h24.5V58h-24.5v-9c0-6.3,2.7-9.2,9.3-9.2H793V16h-32.5c-17.1,0-26.4,11.1-26.4,27.5V58h-20.5v22.7h20.5v82.4h30
        V80.7z'
            />
            <path d='M863,163.1v-62.4h63.3v62.4h32.1V16h-32.1v58.2H863V16h-32.1v147.2H863z' />
            <path
              d='M1020.6,166.5c32.1,0,45.4-17.2,51.3-30.7l-26.8-10.3c-4.4,9.9-11,18.3-24.5,18.3c-12.9,0-22.8-7.6-23.6-26.1h74.5
        c3-35.1-15.6-62.9-51.1-62.9c-30.6,0-53.4,22.5-53.4,55.5C967,144.8,988.1,166.5,1020.6,166.5z M998,96.7
        c2.1-13.2,10.3-20.4,22.4-20.4c12.7,0,20.3,7.4,21.5,20.4H998z'
            />
            <path
              d='M1113.5,166.5c18.2,0,28.1-11.6,32.3-25.2h9.9c0.4,15.6,4.4,21.9,23,21.9h12.5v-22.7h-9.3c-5.7,0-6.3-1.1-6.3-6.3V95.7
        c0-27.7-17.5-40.8-47.1-40.8c-30.8,0-48.3,15.8-50,32.2l27,5.9c2.5-9.9,9.5-16.6,23.2-16.6c12,0,17.3,5.5,17.3,14.5v4
        c-35,3.4-66.3,12-66.3,41.4C1079.8,154.7,1094.1,166.5,1113.5,166.5z M1123.9,144.6c-9.1,0-13.7-4.4-13.7-11.4
        c0-13.9,16.5-17.7,35.9-20v6.7C1146,137.1,1135.5,144.6,1123.9,144.6z'
            />
            <path
              d='M1266.7,163.1v-23.8h-22.8c-6.5,0-9.3-2.9-9.3-9.2V80.7h27.4V58h-27.4V25h-30v33h-22.2v22.7h22.2v54.9
        c0,16.4,9.7,27.5,26.8,27.5H1266.7z'
            />
          </g>
          <path
            ref={dotRef}
            className='pointer-events-auto absolute inset-0'
            onClick={onClick}
            d='M1293,54.9c15.8,0,26.6-11,26.6-25.8c0-14.6-11-26-26.5-26c-15.5,0-26.5,11.4-26.5,26C1266.7,43.5,1277.3,54.9,1293,54.9z
      M1293.2,40.3c-6,0-10.6-4.4-10.6-11.4c0-6.5,4.6-11,10.6-11c6.1,0,10.5,4.4,10.5,11C1303.6,35.7,1299.3,40.3,1293.2,40.3z'
          />
        </svg>
      </div>
    </>
  )
}
