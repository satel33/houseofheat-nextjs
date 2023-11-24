import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import Mono from '../Typography/Mono'
import { buyNowReleasesAtom, selectedReleaseAtom, selectedPanelAtom, PANEL_LINKS } from './buyNowState'
import LinkItem from './LinkItem'

const SelectReleasePanel = () => {
  const releases = useAtomValue(buyNowReleasesAtom)
  const selectRelease = useSetAtom(selectedReleaseAtom)
  const setSelectedPanel = useSetAtom(selectedPanelAtom)

  const onSelectRelease = useCallback((release) => {
    setSelectedPanel(PANEL_LINKS)
    selectRelease(release)
  }, [selectRelease, setSelectedPanel])

  return (
    <ul className='m-4 md:m-6 overflow-hidden p-0'>
      {releases?.map(release => (
        <LinkItem key={release._id} onClick={() => onSelectRelease(release)} className='flex justify-between items-center'>
          <span className='block group-hover:pl-2 transition-[padding]'>{release.title}</span>
          <Mono className='md:opacity-0 group-hover:opacity-100 md:transition-opacity duration-150 p-2 md:px-4 block border-[1px] border-solid border-current md:border-none ml-2'>Select</Mono>
        </LinkItem>
      ))}
    </ul>
  )
}

export default SelectReleasePanel
