import { useRouter } from 'next/router'

export function useIsHomepage () {
  const router = useRouter()
  return router.pathname === '/' || router.asPath === '/'
}
