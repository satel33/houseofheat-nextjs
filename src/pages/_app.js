import Head from 'next/head'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import { useEffect } from 'react'

import { useNightjarBanner } from '../hooks/useNightjarBanner'

import FirebaseProvider from '../auth/FirebaseProvider'
import '../styles/globals.css'
import '../styles/vendors.css'

NProgress.configure({ showSpinner: false })

function MyApp ({ Component, pageProps }) {
  const router = useRouter()

  // On mount, inject the Nightjar ASCII art onto the HTML doc
  useNightjarBanner()

  // Whenever the route changes
  useEffect(() => {
    const handleRouteChangeStart = (url, { shallow }) => {
      if (!shallow) {
        NProgress.start()
        document.body.classList.add('loading')
      }
    }
    const handleRouteChangeError = (url, { shallow }) => {
      if (!shallow) {
        NProgress.done()
        document.body.classList.remove('loading')
      }
    }
    const handleRouteChangeComplete = (url, { shallow }) => {
      if (!shallow) {
        NProgress.done()
        document.body.classList.remove('loading')
      }
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeError', handleRouteChangeError)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeError', handleRouteChangeError)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [])

  return (
    <FirebaseProvider>
      <Head>
        <meta name='viewport' content='width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1' />
      </Head>
      <Component {...pageProps} />
    </FirebaseProvider>
  )
}

export default MyApp
