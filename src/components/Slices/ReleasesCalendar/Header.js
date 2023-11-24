// import dayjs from 'dayjs'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect, useState } from 'react'

import { getNewYorkDate } from '../../../helpers/dates'
import { useReleasesSlice, VIEW_GRID, VIEW_LIST } from '../../../store/articles'
import { brandsForFiltering, settingsAtom } from '../../../store/content'
import getIndexedAtom from '../../../store/getIndexedAtom'
import Filters from '../../Filters'
import BrandFilters from '../../Filters/BrandFilters'
import Toggle from '../../Toggle'
// import MobileToggle from './MobileToggle'

// Create the months filter' values array (May, ...., April, Beyond)
// Note: The returned `_id` value will be used by Algolia to filter search results (= `TIMESTAMP_VALUE TO TIMESTAMP_VALUE`)
const createMonthsFilter = (desc) => {
  return [...Array(12).keys()].map(i => {
    const date = getNewYorkDate()
      .add(i * (desc ? -1 : 1), 'month')
      .startOf('month')

    return {
      _id: date.format('MM'),
      title: date.format('MMM')
    }
  })
}

// const getUpcomingOrDroppedDateFilter = upcoming => {
//   if (upcoming) {
//     return `>=${dayjs().unix()}`
//   }
//   return `<${dayjs().unix()}`
// }

export default function Header ({ id, showBrandFilter = true }) {
  const { labels } = useAtomValue(settingsAtom)

  const brands = useAtomValue(brandsForFiltering)

  const {
    baseAtom,
    viewAtom,
    filtersAtom,
    orderAtom,
    actions
  } = useReleasesSlice(id)
  const setFilters = useSetAtom(filtersAtom)
  const setOrder = useSetAtom(orderAtom)
  const { reload } = actions
  const { filters, view } = useAtomValue(baseAtom)
  const setView = useSetAtom(viewAtom)
  // const [dateFilters, setDateFilters] = useAtom(
  //   getIndexedAtom('releaseDateFilters', id, () => atom([]))
  // )
  const [upcoming, setUpcoming] = useAtom(
    getIndexedAtom('releaseUpcomingToggle', id, () => atom(true))
  )

  useEffect(() => {
    if (filters?.brand) {
      const brand = brands.find(({ _id }) => _id === filters.brand)
      window.history.replaceState(window.history.state, null, `/${brand.slug}-release-dates`)
    } else {
      window.history.replaceState(window.history.state, null, '/releases')
    }
  }, [brands, filters.brand])

  const onBrandSelected = useCallback((value) => {
    reload({ ...filters, brand: filters?.brand === value ? null : value })
  }, [filters, reload])

  // Can't do this in a useMemo as the values will be different on the server and client
  const [monthFilters, setMonthFilters] = useState([])
  useEffect(() => {
    setMonthFilters(createMonthsFilter(!upcoming))
  }, [upcoming])

  const onMonthFilterChanged = useCallback((value) => {
    reload({ ...filters, month: filters?.month === value ? null : value })
  }, [filters, reload])

  // const toggleDates = useCallback(
  //   async value => {
  //     const currentDates = [...(dateFilters || [])]
  //     if (currentDates.includes(value)) {
  //       remove(currentDates, v => v === value)
  //     } else {
  //       currentDates.push(value)
  //     }
  //     setDateFilters(currentDates)
  //     if (isEmpty(currentDates)) {
  //       setFilters(filters => ({
  //         ...filters,
  //         dates: [getUpcomingOrDroppedDateFilter(true)]
  //       }))
  //     } else {
  //       setFilters(filters => ({
  //         ...filters,
  //         dates: currentDates
  //       }))
  //     }
  //     await reload()
  //   },
  //   [dateFilters, setDateFilters, reload, setFilters]
  // )

  const onToggleUpcoming = useCallback(
    async value => {
      setUpcoming(value)
      setFilters(filters => ({ ...filters, month: null }))
      setOrder(value ? 'asc' : 'desc')
      await reload()
    },
    [reload, setFilters, setOrder, setUpcoming]
  )

  return (
    <>
      <div className='grid grid-cols-2 col-span-full md:flex justify-between gap-4'>
        <Filters
          className='row-start-2 justify-self-start !self-start'
          filters={monthFilters}
          selectedFilters={filters.month}
          onToggleFilterId={onMonthFilterChanged}
          label={
            <div className='flex items-center'>
              <span className='inline-block'>Filter</span>
              <span className='inline-block ml-2 w-[3.5em] text-left'>{filters.month ? monthFilters.find(({ _id }) => _id === filters.month)?.title : 'Month'}</span>
            </div>
          }
        />
        {showBrandFilter && (
          <BrandFilters brand={filters.brand} onBrandSelected={onBrandSelected} className='row-start-2 justify-self-end' />
        )}
        <Toggle
          className='md:flex col-start-2 justify-self-end'
          labelOff={labels.sneakerUpcoming}
          labelOn={labels.sneakerReleased}
          hideMobileLabelOff={false}
          onChange={() => onToggleUpcoming(!upcoming)}
          value={!upcoming}
          id='upcoming-toggle'
        />
        <Toggle
          className='col-start-1 row-start-1'
          labelOff={labels.articlesGridView}
          labelOn={labels.articlesListView}
          hideMobileLabelOff={false}
          onChange={() =>
            setView(v => (v === VIEW_GRID ? VIEW_LIST : VIEW_GRID))
          }
          value={view === VIEW_LIST}
          id='grid-toggle'
        />
      </div>
    </>
  )
}
