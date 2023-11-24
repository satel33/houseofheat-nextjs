import { useMemo } from 'react'

export default function useReleasePageTitle (page) {
  return useMemo(() => {
    const release = page.releases?.[0]
    if (release) {
      return release.styleCode ? `${release.title} (${release.styleCode})` : release.title
    }
    return page.title
  }, [page])
}
