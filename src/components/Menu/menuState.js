import { atom, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { isSearchOpenAtom } from './searchState'
// import { atomWithHash } from 'jotai/utils'

// Whether or not the menu is open
export const isMenuOpen = atom(false)
isMenuOpen.debugLabel = 'isMenuOpen'

// export const menuView = atom()

export const MENU_VIEW_MAIN = 'main'
export const MENU_VIEW_PROFILE = 'profile'
export const MENU_VIEW_NOTIFICATIONS = 'notifications'

export const menuView = atom(MENU_VIEW_MAIN)

export const profileSignInErrorAtom = atom()

export const useOpenMenuAtView = () => {
  const setMenuView = useSetAtom(menuView)
  const setOpenMenu = useSetAtom(isMenuOpen)
  const setSearchOpen = useSetAtom(isSearchOpenAtom)
  return useCallback(view => {
    setSearchOpen(false)
    setMenuView(view || MENU_VIEW_MAIN)
    setOpenMenu(true)
  }, [])
}
