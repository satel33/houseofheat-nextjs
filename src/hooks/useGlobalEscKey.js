import { useAtom, useSetAtom } from "jotai"
import { useAtomCallback } from "jotai/utils"
import { useCallback } from "react"
import useKeyDown from "./useKeyDown"
import { MENU_VIEW_MAIN, MENU_VIEW_NOTIFICATIONS, MENU_VIEW_PROFILE, isMenuOpen, menuView } from "../components/Menu/menuState"
import { isSearchOpenAtom } from "../components/Menu/searchState"
import { isBuyNowDialogOpenAtom } from "../components/BuyNowDialog.js/buyNowState"
import { dialogOpenAtom, pageScrollAtom } from "../store/content"
import { isRateSneakerDialogOpen } from "../components/RateSneaker/rateSneakerState"

export default function useGlobalEscKey () {
  const setMenuOpen = useSetAtom(isMenuOpen)
  const setMenuView = useSetAtom(menuView)
  const setSearchOpen = useSetAtom(isSearchOpenAtom)
  const setBuyDialogOpen = useSetAtom(isBuyNowDialogOpenAtom)
  const setDialogOpen = useSetAtom(dialogOpenAtom)
  const setRatingOpen = useSetAtom(isRateSneakerDialogOpen)
  const setDialogScrollProgress = useSetAtom(pageScrollAtom)

  const readMenuOpen = useAtomCallback(useCallback((get) => get(isMenuOpen)))
  const readView = useAtomCallback(useCallback((get) => get(menuView)))
  const readSearchOpen = useAtomCallback(useCallback((get) => get(isSearchOpenAtom)))
  const readBuyOpen = useAtomCallback(useCallback((get) => get(isBuyNowDialogOpenAtom)))
  const readDialogOpen = useAtomCallback(useCallback((get) => get(dialogOpenAtom)))
  const readRatingOpen = useAtomCallback(useCallback((get) => get(isRateSneakerDialogOpen)))
  
  const handleEsc = async () => {
    const menuOpen = await readMenuOpen()
    const view = await readView()
    const searchOpen = await readSearchOpen()
    const buyOpen = await readBuyOpen()
    const dialogOpen = await readDialogOpen()
    const ratingOpen = await readRatingOpen()
    
    if (view === MENU_VIEW_NOTIFICATIONS || view === MENU_VIEW_PROFILE) {
      setMenuView(MENU_VIEW_MAIN)
      return
    }
    if (searchOpen) {
      setSearchOpen(false)
      setMenuView(MENU_VIEW_MAIN)
      return
    }
    if (menuOpen) {
      setMenuOpen(false)
      return
    }
    if (ratingOpen) {
      setRatingOpen(false)
      return
    }
    if (buyOpen) {
      setBuyDialogOpen(false)
      return
    }
    if (dialogOpen) {
      setDialogOpen(false)
      setDialogScrollProgress(0)
      return
    }
  }


  useKeyDown(handleEsc)
}