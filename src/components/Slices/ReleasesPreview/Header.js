import cn from 'clsx'
import { useAtomValue } from 'jotai'
import { useCallback, useState } from 'react'

// import { useAlgoliaReleasesSlice } from '../../../store/algolia'
import { useReleasesSlice } from '../../../store/articles'
import { settingsAtom } from '../../../store/content'
import gradients from '../../../theme/gradients.cjs'
import CallToAction from '../../CallToAction'
import BrandFilters from '../../Filters/BrandFilters'
import Toggle from '../../Toggle'
import Heading from '../../Typography/Heading'

export default function Header ({ title, link, id, showBrandFilter }) {
  const { labels } = useAtomValue(settingsAtom)
  const [hoverStyles, setHoverStyles] = useState(false)

  const { baseAtom, actions } = useReleasesSlice(id)
  const { reload } = actions
  const { order, filters } = useAtomValue(baseAtom)

  const onOrderChanged = useCallback(
    e => {
      const o = e.target.checked ? 'desc' : 'asc'
      reload(undefined, o)
    },
    [reload]
  )

  const onBrandSelected = useCallback((value) => {
    reload({ ...filters, brand: filters?.brand === value ? null : value })
  }, [filters, reload])

  const showPastReleases = order === 'desc'

  return (
    <>
      <div className='col-span-full md:col-span-7 mb-2 md:mb-0'>
        <header className='w-full inline-flex items-end justify-between md:justify-start md:gap-8'>
          <Heading as='h2' tagStyle='h1'>
            {showPastReleases ? labels.sneakerReleased : title}
          </Heading>
          <CallToAction link={link} className='md:mb-2 md:hidden whitespace-nowrap' roundedStyles={false}/>
        </header>
      </div>
      <div className='col-span-full md:col-span-5'>
        <header
          className={cn(
            'flex h-full items-center md:items-end md:pb-2 justify-between'
          )}
        >
          <Toggle
            id='futures-releases'
            labelOff={labels.sneakerUpcoming}
            labelOn={labels.sneakerReleased}
            onChange={onOrderChanged}
            value={showPastReleases}
          />
          {showBrandFilter && (
            <BrandFilters
              brand={filters.brand}
              onBrandSelected={onBrandSelected}
              fromLeftSide={false}
              gradientColorFrom={gradients[0].from}
              gradientColorTo={gradients[0].to}
              alternateColour
              labelClassName='opacity-50'
            />
          )}
          <div className="relative hidden md:block rounded-full w-[6.2rem] h-[1.8rem] px-2" onMouseEnter={() => setHoverStyles(true)} onMouseLeave={() => setHoverStyles(false)}>
            <div className={cn('absolute inset-0 hidden opacity-0 md:block rounded-full w-full h-[1.78rem] px-2 py-[0.1rem] gradients-call-to-action transition-opacity duration-200', hoverStyles && 'opacity-100')} />
            <div className={cn('absolute inset-px hidden md:block rounded-full w-[calc(100%-2px)] h-[1.66rem] px-4 py-[0.1rem] bg-white')} />
            <CallToAction link={link} className="absolute top-px left-1/2 -translate-x-1/2 w-[4.8rem] h-full" roundedStyles={false} />
          </div>
        </header>
      </div>
    </>
  )
}
