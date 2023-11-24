import compact from 'lodash/compact'
import { createHydratedAlgoliaAtoms } from './algolia'
import { createHydratedArticleAtoms } from './articles'

import { useMemo } from 'react'
import { headerState } from '../components/Menu/headerState'
import { isBrowser } from '../components/ReleaseActions/device'
import { useIsHomepage } from '../hooks/useIsHomepage'
import screens from '../theme/screens.cjs'
import { settingsAtom, sharedDataAtom } from './content'
import { useSSRHydrateAtoms } from './useSSRHydrateAtoms'

export const useHydrateStore = (settings, shared, page) => {
  const isHomepage = useIsHomepage()
  createHydratedAlgoliaAtoms(page)
  createHydratedArticleAtoms(page)
  const initialHeaderState = useMemo(() => {
    const isMobile = isBrowser() && window.innerWidth <= parseInt(screens.md)
    return { expanded: true, large: isMobile || isHomepage }
  }, [])

  useSSRHydrateAtoms(
    compact([
      [settingsAtom, settings],
      [sharedDataAtom, shared],
      [headerState, initialHeaderState]
    ])
  )
}
