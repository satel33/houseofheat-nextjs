import defer from 'lodash/defer'
import { useEffect } from 'react'
import { pageview } from '../helpers/gtm'
import { resolveInternalLinkUrl } from '../helpers/resolvers'

export default function usePageTracking (page) {
  useEffect(() => {
    const path = resolveInternalLinkUrl(page)
    defer(() => pageview(path))
  }, [page])
}
