import cn from 'clsx'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import get from 'lodash/get'
import kebabCase from 'lodash/kebabCase'
import { useCallback, useEffect, useRef, useState } from 'react'

import isEmpty from 'lodash/isEmpty'
import qs from 'querystringify'
import { forwardRef, useImperativeHandle } from 'react'
import { getPageThemeColor } from '../../helpers/page'
import { useSmallBrandLogo } from '../../hooks/useBrand'
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback'
import CrossIcon from '../../icons/cross.svg'
import MagnifyingGlassIcon from '../../icons/magnifying-glass.svg'
import { useAlgoliaSearchAtoms } from '../../store/algolia'
import { settingsAtom } from '../../store/content'
import ArticleMeta from '../ArticleTile/ArticleMeta'
import BrandLogo from '../ArticleTile/BrandLogo'
import Link from '../Link'
import LoadMore from '../LoadMore'
import ResponsiveImage from '../ResponsiveImage'
import RichContent from '../RichContent'
import Mono, { MonoSmall, MonoTag } from '../Typography/Mono'
import { isMenuOpen } from './menuState'
import { isSearchOpenAtom, savePreviousSearchesAtom } from './searchState'

const Search = forwardRef((props, ref) => {
  const [open, setOpen] = useAtom(isSearchOpenAtom)
  const { search: searchSettings } = useAtomValue(settingsAtom)
  const [searchValue, setSearchValue] = useState('')
  const [savedSearches, saveSearch] = useAtom(savePreviousSearchesAtom)
  const setMenuOpen = useSetAtom(isMenuOpen)
  const localRef = useRef({ mounted: false })
  const inputRef = useRef()

  const { baseAtom, actions } = useAlgoliaSearchAtoms('search')
  const { search, loadMore } = actions

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus({ preventScroll: true })
    }
  }), [])

  const {
    query,
    items,
    index,
    totalPages,
    loading: isSearching
  } = useAtomValue(baseAtom)
  const hasMorePages = totalPages > index + 1

  const searchDebounced = useDebouncedCallback(search, 200, [search])

  // Display
  const showResults = items?.length > 0
  const showRecentSearches = showResults && !query
  const showEmptyResults = !items?.length && query

  // On input change, IF THE UI IS OPEN, actually execute the search
  const onChange = useCallback(e => {
    setSearchValue(e.target.value)
  }, [])

  useEffect(() => {
    if (isEmpty(query) || query.length < 3) return
    saveSearch(query)
  }, [query, items, saveSearch])

  // On input value change, IF THE UI IS OPEN, actually execute the search
  useEffect(() => {
    if (!open || !localRef.current.mounted) return
    searchDebounced(searchValue)
    window.history.replaceState(
      window.history.state,
      null,
      `${window.location.pathname}?q=${encodeURIComponent(searchValue)}`
    )
  }, [open, searchDebounced, searchValue])

  const onClearSearch = useCallback(() => {
    setSearchValue('')
  }, [])

  const onLoadMore = useCallback(() => {
    loadMore()
  }, [loadMore])

  useEffect(() => {
    localRef.current.mounted = true
  }, [])

  useEffect(() => {
    const query = qs.parse(window.location.search)?.q
    if (query) {
      setMenuOpen(true)
      setOpen(true)
      setSearchValue(query)
    }
  }, [])

  useEffect(() => {
    if (!open) {
      window.history.replaceState(window.history.state, null, `${window.location.pathname}`)
    }
  }, [open])

  const onOpenSearch = useCallback(() => {
    setOpen(true)
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <section className='h-full flex flex-col overflow-hidden'>
      <form className='flex items-center justify-between px-6 relative' onSubmit={(e) => { e.preventDefault() }}>
        <MagnifyingGlassIcon height={18} className='mx-2 pointer-events-none' />
        <input
          type='text'
          className='flex-1 h-[64px] px-3 rounded-menu outline-0 font-mono text-sm placeholder-black uppercase outline-none'
          onChange={onChange}
          placeholder={searchSettings.placeholderText}
          value={searchValue}
          ref={inputRef}
          // onFocus={onSearchFocus}
        />
        <button
          type='button'
          className={cn(
            'flex items-center justify-center w-8 aspect-square transition-opacity duration-150',
            searchValue ? 'hover:opacity-50' : 'opacity-0 pointer-events-none'
          )}
          disabled={isSearching}
          onClick={onClearSearch}
        >
          <CrossIcon height={13} />
        </button>
        {!open && <button className='absolute inset-0' onClick={onOpenSearch} />}
      </form>
      {showResults && !showRecentSearches && (
        <div
          className='flex-1 overflow-hidden rounded-b-menu'
          style={{ height: 'calc(100% - 64px)' }}
        >
          <ul
            className={cn(
              'h-full px-6 rounded-b-menu pb-10',
              open ? 'overflow-y-auto' : 'overflow-hidden'
            )}
          >
            {items.map(article => (
              <li key={article._id} className='py-2 border-b last:border-0'>
                <SearchResult article={article} />
              </li>
            ))}
            <li>
              {hasMorePages && (
                <LoadMore onAppearInView={onLoadMore} className='my-4 -mx-6' showGradient={false} />
              )}
            </li>
          </ul>
        </div>
      )}
      {showRecentSearches && (
        <div className='flex-1 h-full overflow-y-auto px-6 rounded-b-menu'>
          <MonoSmall as='p' className='mb-4 opacity-50'>
            Recent
          </MonoSmall>
          <ul>
            {savedSearches.map((query, i) => (
              <li key={`${kebabCase(query)}-${i}`}>
                <RecentSearchQuery query={query} onClick={setSearchValue} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {showEmptyResults && (
        <div className='flex-1 h-full overflow-y-auto px-6 rounded-b-menu'>
          <RichContent content={searchSettings.emptyResultsCopy} />
        </div>
      )}
    </section>
  )
})

/** Note: This should look the same as Slices/Releases/Release.js on mobile & ArticleListItem, but feels too different to merge them */
function SearchResult ({ article }) {
  const { featuredImages, title } = article
  const image = get(featuredImages, [0])
  const setOpen = useSetAtom(isMenuOpen)

  const brandLogo = useSmallBrandLogo(article)
  const brand = article?.brand
  const backgroundColor = getPageThemeColor(article)
  const onClick = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <Link link={article} showText={false} className='block hover:opacity-70' onClick={onClick}>
      <article className='grid grid-cols-5 gap-x-5'>
        <div
          className='col-span-2 w-full flex items-center'
          style={{ backgroundColor }}
        >
          <ResponsiveImage
            image={image}
            aspect={120 / 100}
            contain={!image.cover}
            imageSizes='320px'
          />
        </div>
        <div className='col-span-3 flex flex-col justify-end gap-3'>
          {brand && brandLogo && (
            <BrandLogo
              logoImage={brandLogo}
              className='h-5 w-auto self-start'
            />
          )}
          {brand && !brandLogo && <MonoTag>{brand?.title}</MonoTag>}
          <p className='text-[0.875rem] line-clamp-2'>{title}</p>
          <div className='flex items-center'>
            <ArticleMeta
              className='text-xxs w-full'
              article={article}
              showBuyNow={false}
              max
              isSearch
            />
          </div>
        </div>
      </article>
    </Link>
  )
}

function RecentSearchQuery ({ query, onClick }) {
  const onSelect = useCallback(() => onClick(query), [onClick, query])

  return (
    <button className='hover:opacity-50 text-left' onClick={onSelect}>
      <Mono className='block'>{query}</Mono>
    </button>
  )
}

export default Search
