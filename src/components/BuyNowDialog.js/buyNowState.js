import { atom, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import isEmpty from 'lodash/isEmpty'
import { useAtomCallback } from 'jotai/utils'

export const PANEL_RELEASE = 'PANEL_RELEASE'
export const PANEL_LINKS = 'PANEL_LINKS'

export const isBuyNowDialogOpenAtom = atom(false)
export const buyNowPageAtom = atom()
export const buyNowReleasesAtom = atom()
export const selectedReleaseAtom = atom()
export const selectedPanelAtom = atom(PANEL_RELEASE)

export const useBuyNowDialogToggleCallback = () => {
  const setIsBuyNowDialogOpen = useSetAtom(isBuyNowDialogOpenAtom)
  const setBuyNowReleases = useSetAtom(buyNowReleasesAtom)
  const setBuyNowPage = useSetAtom(buyNowPageAtom)
  const setSelectedModel = useSetAtom(selectedReleaseAtom)
  const setSelectedPanel = useSetAtom(selectedPanelAtom)
  const getIsOpen = useAtomCallback(useCallback((get) => {
    return get(isBuyNowDialogOpenAtom)
  }, []))
  return useCallback(async (pageOrRelease) => {
    const open = await getIsOpen()
    let releases = []
    if (pageOrRelease._type === 'page') {
      releases = pageOrRelease.releases
    }
    if (pageOrRelease._type === 'release') {
      releases.push(pageOrRelease)
    }
    setIsBuyNowDialogOpen(o => isEmpty(releases) ? false : !o)
    setBuyNowReleases(releases)
    setBuyNowPage(pageOrRelease)
    if (!open) {
      setSelectedModel(releases.length === 1 ? releases[0] : null)
      setSelectedPanel(releases.length === 1 ? PANEL_LINKS : PANEL_RELEASE)
    }
  }, [getIsOpen, setIsBuyNowDialogOpen, setBuyNowReleases, setBuyNowPage, setSelectedModel, setSelectedPanel])
}
