import { useEffect, useRef } from 'react'

const defaultEvents = ['mousedown', 'touchstart']

const useOutsideClick = (
  onOutsideClick,
  enabled = true,
  events = defaultEvents
) => {
  const ref = useRef()
  useEffect(() => {
    if (enabled) {
      const handler = (event) => {
        const { current: el } = ref
        el && !el.contains(event.target) && onOutsideClick(event)
      }
      for (const eventName of events) {
        window.document.addEventListener(eventName, handler)
      }
      return () => {
        for (const eventName of events) {
          window.document.removeEventListener(eventName, handler)
        }
      }
    }
  }, [onOutsideClick, events, enabled])

  return ref
}

export default useOutsideClick
