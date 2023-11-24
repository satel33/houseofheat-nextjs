import cn from 'clsx'
import { primaryInput } from 'detect-it'
import { useAtom, useAtomValue } from 'jotai'
import { useCallback } from 'react'
import useBodyScrollLock from '../../hooks/useBodyScrollLock'
import screens from '../../theme/screens.cjs'
import ResponsiveImage from '../ResponsiveImage'
import { MonoTag } from '../Typography/Mono'
import BuyLinks from './BuyLinksPanel'
import {
  buyNowReleasesAtom,
  isBuyNowDialogOpenAtom,
  PANEL_LINKS,
  PANEL_RELEASE,
  selectedPanelAtom,
  selectedReleaseAtom
} from './buyNowState'
import Label from './Label'
import PanelsContainer from './PanelsContainer'
import SelectReleasePanel from './SelectReleasePanel'

const BuyNowDialog = () => {
  const open = useAtomValue(isBuyNowDialogOpenAtom)
  const [selectedPanel, setSelectedPanel] = useAtom(selectedPanelAtom)
  const releases = useAtomValue(buyNowReleasesAtom)
  const hasMoreThenOneRelease = releases?.length > 1
  const selectedRelease = useAtomValue(selectedReleaseAtom)

  const bodyScrollRef = useBodyScrollLock(primaryInput === 'touch' && open)

  const onGoBackToReleasesPanel = useCallback(() => {
    setSelectedPanel(PANEL_RELEASE)
  }, [])

  const image = selectedRelease?.featuredImage

  return (
    <div
      className={cn(
        'h-[70vh] text-current relative flex flex-col md:flex-row',
        'bottom-line'
      )}
      ref={bodyScrollRef}
    >
      <div
        className={cn(
          'md:w-1/2 flex-shrink-0 h-full relative',
          'bottom-line',
          'after:md:hidden',
          'flex flex-col'
        )}
      >
        <div className='m-4 md:m-6 relative h-6 flex-grow-0 flex-shrink-0'>
          <button
            onClick={onGoBackToReleasesPanel}
            className={cn(
              'absolute top-0 h-6 transition-opacity duration-150 ease-in-out p-0 m-0 border-none',
              hasMoreThenOneRelease && selectedPanel === PANEL_LINKS
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            )}
          >
            <MonoTag>{'< Choose A  Different Model'}</MonoTag>
          </button>
          <Label
            className={cn(
              'absolute top-0 h-6 transition-opacity duration-150 ease-in-out',
              selectedPanel === PANEL_RELEASE
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            )}
          >
            Select Model
          </Label>
        </div>
        <div className='hidden md:flex mx-4 md:mx-6 mb-4 md:mb-6 flex-grow flex-shrink justify-center items-center relative'>
          <ResponsiveImage
            key={image?.asset?.url}
            image={image}
            className={cn('!absolute inset-0 duration-200 transition-opacity', !open && 'opacity-0')}
            imageSizes={`(max-width: ${screens.md}) 100vw, 50vw`}
            contain={!image?.cover}
          />
        </div>
      </div>
      <div className='md:w-1/2 flex-shrink-0 absolute md:static left-0 right-0 top-toolbar bottom-0'>
        <PanelsContainer index={selectedPanel === PANEL_RELEASE ? 0 : 1}>
          <SelectReleasePanel />
          <BuyLinks />
        </PanelsContainer>
      </div>
    </div>
  )
}

export default BuyNowDialog
