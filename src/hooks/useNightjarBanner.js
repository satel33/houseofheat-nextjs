import { useEffect, useRef } from 'react'

import banner from '../../public/nightjar.txt'

// Add the Nightjar ASCII art banner to the HTML document (Add this to the _app.js file!)
export function useNightjarBanner () {
  const isMounted = useRef(false)

  useEffect(() => {
    if (!isMounted.current) {
      const bannerComment = `<!--[if lt IE 3]>${banner}<![endif]-->`
      document.body.parentNode.insertAdjacentHTML('afterbegin', bannerComment)
      isMounted.current = true
    }
  }, [])
}
