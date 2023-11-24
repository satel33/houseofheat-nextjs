import { useAtomValue } from 'jotai'
import filter from 'lodash/filter'
import uniq from 'lodash/uniq'
import { useCallback, useState } from 'react'
import { useFirebaseContext, useIsAuthenticated } from '../auth'
import { userProfileAtom } from '../auth/authState'
import {
  MENU_VIEW_PROFILE,
  useOpenMenuAtView
} from '../components/Menu/menuState'

export function useFollowingBrandsAndModels () {
  const profile = useAtomValue(userProfileAtom)
  const authenticated = useIsAuthenticated()
  const [loading, setLoading] = useState(false)
  const openMenu = useOpenMenuAtView()
  const firebaseContext = useFirebaseContext()

  const toggle = useCallback(async (prop, id) => {
    if (!authenticated) {
      openMenu(MENU_VIEW_PROFILE)
      return
    }

    if (!firebaseContext.ready) return

    setLoading(true)

    const { firestore: { store, doc, setDoc } } = firebaseContext

    let following = profile?.[prop] || []
    const isFollowing = following.includes(id)

    following = isFollowing
      ? filter(following, f => f !== id)
      : uniq([...following, id])

    await setDoc(doc(store, 'users', profile.uid), {
      [prop]: following
    }, {
      merge: true
    })

    setLoading(false)
  }, [authenticated, firebaseContext, openMenu, profile])

  const toggleBrand = useCallback((id) => toggle('followingBrands', id), [toggle])
  const toggleModel = useCallback((id) => toggle('followingModels', id), [toggle])

  return {
    followingBrands: profile?.followingBrands,
    followingModels: profile?.followingModels,
    toggleBrand,
    toggleModel,
    loading
  }
}
