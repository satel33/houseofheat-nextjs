import { useCallback, useEffect } from 'react'
import ScrollHistory from './scrollHistory'
import debounce from 'lodash/debounce'
import { useRouter } from 'next/router'
import defer from 'lodash/defer'
import delay from 'lodash/delay'

const scrollHistory = new ScrollHistory('page')

let paused = false

export function useRestoreScrollState () {
  return useCallback(() => {
    const state = window?.history?.state
    if (state?.key && state.options.popState) {
      const y = scrollHistory.get(state.key, state.as) || 0
      // The page gets set on this tick, so we need to restore it on the next tick when it has all the content
      defer(() => window.scrollTo({ top: y, left: 0, behavior: 'instant' }))
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [])
}

export function useScrollHistory (page) {
  const router = useRouter()

  const restoreScrollState = useRestoreScrollState()

  useEffect(() => {
    const scroll = debounce(() => {
      if (!paused) {
        const state = window?.history?.state
        if (state) {
          scrollHistory.set(state.key, state.as, window.scrollY)
        }
      }
    }, 50, { trailing: true, leading: false })
    window.addEventListener('scroll', scroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', scroll)
    }
  }, [])

  useEffect(() => {
    router.beforePopState(state => {
      state.options.scroll = false
      state.options.popState = true
      return true
    })

    const handleRouteChangeStart = () => { paused = true }
    const handleRouteChanged = () => {
      delay(() => { paused = false }, 250)
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChanged)
    router.events.on('routeChangeError', handleRouteChanged)
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChanged)
      router.events.on('routeChangeError', handleRouteChanged)
    }
  }, [])

  useEffect(() => {
    restoreScrollState()
  }, [page])

  return {
    get: () => scrollHistory.get(window.history.state?.key, window.history.state?.as) || 0
  }
}
