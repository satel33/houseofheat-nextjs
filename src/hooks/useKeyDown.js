import { useEffect } from 'react'

// esc by default
export default function useKeyDown(fn, key = 27) {
  useEffect(() => {
    document.addEventListener('keydown', handleKey, false)
    return () => [document.removeEventListener('keydown', handleKey, false)]
  }, [])

  function handleKey (e) {
    if (e.keyCode === key) {
      fn()
    }
  }
}