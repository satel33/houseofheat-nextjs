import { primaryInput } from 'detect-it'
import { forwardRef, useEffect, useRef } from 'react'
import forEach from 'lodash/forEach'
import gsap from 'gsap'
import lerp from 'lerp'
import remove from 'lodash/remove'
import { atom, useAtomValue, useSetAtom } from 'jotai'

const EASE = 0.5

const showDragCursorAtom = atom(false)

export const data = {
  current: {
    x: undefined,
    y: undefined
  },
  last: {
    x: undefined,
    y: undefined
  },
  ease: EASE
}

export const DragIcon = forwardRef(({ className }, ref) => {
  return (
    <svg viewBox='-2 0 101 40' fill='none' xmlns='http://www.w3.org/2000/svg' className={className} ref={ref}>
      <path d='M0.28125 19C0.28125 8.50659 8.78784 0 19.2812 0H79.7519C90.2453 0 98.7518 8.50659 98.7518 19C98.7518 29.4934 90.2452 38 79.7518 38H19.2812C8.78782 38 0.28125 29.4934 0.28125 19Z' fill='white' stroke='black' strokeWidth={1} />
      <path d='M18.5156 23.5L14.2803 19L18.5156 14.5' stroke='black' strokeWidth={1} />
      <path d='M33.7075 14.2V24H36.4375C39.1955 24 40.7495 22.152 40.7495 19.072C40.7495 16.132 39.1395 14.2 36.5075 14.2H33.7075ZM35.0655 22.754V15.446H36.3255C38.5095 15.446 39.3075 16.874 39.3075 19.072C39.3075 21.438 38.4815 22.754 36.2275 22.754H35.0655ZM43.53 24V19.94H45.028C46.302 19.94 47.002 20.388 47.212 21.634L47.604 24H49.088L48.598 21.536C48.36 20.346 47.884 19.688 46.568 19.478C47.842 19.226 48.906 18.372 48.906 16.86C48.906 15.362 47.772 14.2 45.742 14.2H42.172V24H43.53ZM43.53 15.446H45.588C46.68 15.446 47.478 15.922 47.478 17.084C47.478 18.218 46.68 18.722 45.574 18.722H43.53V15.446ZM57.7066 24L54.9206 14.2H52.9746L50.1326 24H51.5326L52.2326 21.368H55.5646L56.2646 24H57.7066ZM53.3386 17.266C53.5206 16.566 53.7026 15.88 53.8986 15.18H53.9266C54.1226 15.88 54.3046 16.566 54.4866 17.266L55.2426 20.122H52.5686L53.3386 17.266ZM62.2651 24.196C63.7211 24.196 64.3791 23.132 64.6171 22.306V24H65.8491V19.17H62.2651V20.402H64.5331C64.4771 22.04 63.6651 22.936 62.4331 22.936C60.9351 22.936 60.0671 21.76 60.0671 19.072C60.0671 16.678 60.8371 15.264 62.4191 15.264C63.7491 15.264 64.3371 16.272 64.5751 17.336L65.8771 16.888C65.5551 15.502 64.6311 14.004 62.4331 14.004C60.2351 14.004 58.6391 15.754 58.6391 19.086C58.6391 22.516 60.1231 24.196 62.2651 24.196Z' fill='black' />
      <path d='M80.5156 14.5L84.7509 19L80.5156 23.5' stroke='black' strokeWidth={1} />
    </svg>

  )
})

const mouseMoveCallbacks = []

export const useCursor = (mouseMoveCallback) => {
  useEffect(() => {
    mouseMoveCallbacks.push(mouseMoveCallback)
    return () => {
      remove(mouseMoveCallbacks, x => x === mouseMoveCallback)
    }
  }, [mouseMoveCallback])
}

export const useDragCursor = (size = 1) => {
  const ref = useRef()
  const setShowDragCursor = useSetAtom(showDragCursorAtom)
  useEffect(() => {
    if (primaryInput !== 'touch' && ref.current) {
      const element = ref.current
      const onMouseEnter = () => {
        setShowDragCursor(size)
      }
      const onMouseLeave = () => {
        setShowDragCursor(false)
      }

      element.addEventListener('mouseenter', onMouseEnter)
      element.addEventListener('mouseleave', onMouseLeave)
      return () => {
        onMouseLeave()
        element.removeEventListener('mouseenter', onMouseEnter)
        element.removeEventListener('mouseleave', onMouseLeave)
      }
    }
  }, [size])
  return ref
}

const Cursor = () => {
  const ref = useRef()
  const dragIconRef = useRef()
  const showDragCursor = useAtomValue(showDragCursorAtom)

  useEffect(() => {
    if (primaryInput !== 'touch') {
      ref.current.style.opacity = 1
      const updateMousePosition = (evnt) => {
        const e = evnt.detail && evnt.detail.pageX ? evnt.detail : evnt
        data.current.x = e.pageX
        data.current.y = e.pageY - (window.pageYOffset || document.documentElement.scrollTop)
      }
      window.addEventListener('mousemove', updateMousePosition, { passive: true })
      window.addEventListener('dragover', updateMousePosition, { passive: true })
      window.addEventListener('keenslider_mousemove', (e) => { updateMousePosition(e.detail) }, { passive: true })
      return () => {
        window.removeEventListener('mousemove', updateMousePosition)
        window.removeEventListener('dragover', updateMousePosition)
        window.removeEventListener('keenslider_mousemove', updateMousePosition)
      }
    }
  }, [])

  useEffect(() => {
    if (primaryInput !== 'touch') {
      const track = () => {
        if (data.current.x !== undefined) {
          // on the initial mouse move, we do not want any easing. Just put the mouse on the cursor
          if (data.last.x === undefined) {
            data.last.x = data.current.x
            data.last.y = data.current.y
          } else {
            data.last.x = lerp(data.last.x, data.current.x, data.ease)
            data.last.y = lerp(data.last.y, data.current.y, data.ease)
          }

          forEach(mouseMoveCallbacks, cb => cb(data))
          ref.current.style.transform = `translate(${data.last.x}px, ${data.last.y}px)`
        }
      }
      gsap.ticker.add(track)
      return () => {
        gsap.ticker.remove(track)
      }
    }
  }, [])

  useEffect(() => {
    if (dragIconRef.current) {
      const tl = gsap.timeline()
      tl.to(dragIconRef.current, {
        scale: !showDragCursor ? 0 : showDragCursor,
        duration: showDragCursor ? 1.2 : 0.3,
        ease: showDragCursor ? 'elastic.out(1, 0.35)' : 'power4.out'
      })
      return () => {
        tl.kill()
      }
    }
  }, [showDragCursor])

  return (
    <div ref={ref} className='fixed top-0 left-0 z-cursor pointer-events-none'>
      <DragIcon
        className='w-24 h-10 absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 scale-0'
        ref={dragIconRef}
      />
    </div>
  )
}

export default Cursor
