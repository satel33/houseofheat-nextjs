import { useCallback, useEffect, useRef } from 'react'
import { disableBodyScroll, enableBodyScroll } from '../helpers/bodyScrollLock'
import remove from 'lodash/remove'
import forEach from 'lodash/forEach'

const listeners = []

export const useBodyScrollLockListener = callback => {
  useEffect(() => {
    listeners.push(callback)
    return () => {
      remove(listeners, x => x === callback)
    }
  }, [callback])
}

export const useBodyScrollLockScrollbarPadding = (
  ref,
  prop = 'paddingRight',
  invert
) => {
  useBodyScrollLockListener(
    useCallback(locked => {
      if (ref.current) {
        const value = invert ? !locked : locked
        const scrollBarGap =
          window.innerWidth - document.documentElement.clientWidth
        if (prop === 'width') {
          ref.current.style[prop] = value
            ? `calc(100% - ${scrollBarGap}px`
            : '100%'
        } else {
          ref.current.style[prop] = `${value ? scrollBarGap : 0}px`
        }
      }
    }, [])
  )
}

export default function useBodyScrollLock (locked, options = {}) {
  const state = useRef({ el: null, locked })

  return useCallback(
    el => {
      if (el && locked) {
        forEach(listeners, func => func(true))
        disableBodyScroll(el, { reserveScrollBarGap: true, ...options })
      }

      const { el: prevEl, locked: prevLocked } = state.current
      if (prevEl && prevLocked) {
        enableBodyScroll(prevEl)
        forEach(listeners, func => func(false))
      }

      state.current.el = el
      state.current.locked = locked
    },
    [locked]
  ) /* eslint-disable-line */
}
