import cn from 'clsx'
import React, { useCallback } from 'react'

import CallToAction from '../../CallToAction'
import Toggle from '../../Toggle'
import Heading from '../../Typography/Heading'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { hasLink } from '../../../helpers/resolvers'
import {
  useArticlesSlice,
  VIEW_GRID,
  VIEW_LIST
} from '../../../store/articles'
import { settingsAtom } from '../../../store/content'
import gradients from '../../../theme/gradients.cjs'
import BrandFilters from '../../Filters/BrandFilters'
import {
  TAB_LATEST,
  TAB_TRENDING,
  useTrendingLatestTabAtom
} from './articlesState'

export default function ArticlesHeader ({ data, id }) {
  const {
    title,
    link,
    displayToggleListView,
    displayToggleTrending
  } = data
  const { labels } = useAtomValue(settingsAtom)

  const [tab, setTab] = useAtom(useTrendingLatestTabAtom(id))
  const { baseAtom, viewAtom, actions } = useArticlesSlice(id)
  const { reload } = actions
  const { view, filters } = useAtomValue(baseAtom)
  const setView = useSetAtom(viewAtom)

  const onBrandSelected = useCallback((value) => {
    reload({ ...filters, brand: filters?.brand === value ? null : value })
  }, [filters, reload])

  // UI states
  const isTitleRowHalved = title || link // If "title" or "link" is present, we display them on the left of the row
  const isFiltersRowShown =
    link || displayToggleTrending || displayToggleListView

  const onSetTab = useCallback(() => {
    setTab(tab => (tab === TAB_TRENDING ? TAB_LATEST : TAB_TRENDING))
  }, [setTab])

  const onSetView = useCallback(() => {
    setView(v => (v === VIEW_GRID ? VIEW_LIST : VIEW_GRID))
  }, [setView])

  return (
    <>
      {isTitleRowHalved && (
        <div className='col-span-full md:col-span-6 mb-2 md:mb-6'>
          <header className='w-full inline-flex items-end md:gap-8'>
            {title && (
              <Heading as='h2' tagStyle='h1'>
                {tab === TAB_TRENDING ? labels.articlesTrending : title}
              </Heading>
            )}
            {hasLink(link) && (
              <CallToAction
                link={link}
                className='hidden md:inline-flex md:mb-2'
              />
            )}
          </header>
        </div>
      )}
      {/* Filters container */}
      {isFiltersRowShown && (
        <div
          className={cn('col-span-full md:mb-6', isTitleRowHalved && 'md:col-span-6')}
        >
          <header
            className={cn(
              'flex flex-wrap md:h-full items-center justify-between md:items-end gap-4 md:gap-0',
              isTitleRowHalved ? 'md:pb-2' : 'md:pb-10'
            )}
          >
            {/* CTA (Mobile only) */}
            {hasLink(link) && (
              <div className='inline-flex md:hidden col-span-6 col-start-7 justify-end'>
                <CallToAction link={link} />
              </div>
            )}
            {/* Toggle between latest & trending articles */}
            {displayToggleTrending && (
              <Toggle
                className='col-span-6 col-start-1 row-start-1 mb-1 md:order-1'
                id='trending-articles'
                hideMobileLabelOff={false}
                labelOff={labels.articlesLatest}
                labelOn={labels.articlesTrending}
                onChange={onSetTab}
                value={tab === TAB_TRENDING}
              />
            )}
            {tab === TAB_LATEST && (
              <BrandFilters
                brand={filters.brand}
                onBrandSelected={onBrandSelected}
                className='col-span-6 mb-1 order-2'
                gradientColorFrom={gradients[0].from}
                gradientColorTo={gradients[0].to}
                alternateColour
                labelClassName='opacity-50'
              />
            )}
            {/* Toggle between grid & list views */}
            {tab === TAB_LATEST && displayToggleListView && (
              <Toggle
                className='col-span-6 justify-end mb-1 md:order-3'
                hideMobileLabelOff={false}
                labelOff={labels.articlesGridView}
                labelOn={labels.articlesListView}
                onChange={onSetView}
                value={view === VIEW_LIST}
                id='grid-toggle'
              />
            )}
          </header>
        </div>
      )}
    </>
  )
}
