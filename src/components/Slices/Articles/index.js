import { useAtomValue, useSetAtom } from 'jotai'
import React, { useEffect } from 'react'

import {
  useArticlesSlice,
  VIEW_GRID,
  VIEW_LIST
} from '../../../store/articles'
import LoadMore from '../../LoadMore'
import Section from '../../Section'
import ArticlesGrid from './ArticlesGrid'
import ArticlesList from './ArticlesList'
import {
  TAB_TRENDING,
  useLoadTrendingArticlesCallback,
  useTrendingArticlesAtom,
  useTrendingLatestTabAtom
} from './articlesState'
import Header from './Header'
import TrendingArticlesList from './TrendingArticleList'

export default function Articles ({ data, page }) {
  const { showNewsletterSubscription, newsletterSlice } = data
  const id = page._id + data.key

  const { baseAtom, actions } = useArticlesSlice(id)
  const { loadMore } = actions
  const { items, index, totalPages, view } = useAtomValue(baseAtom)
  const hasMorePages = totalPages > index + 1

  const tab = useAtomValue(useTrendingLatestTabAtom(id))
  const loadTrendingArticle = useLoadTrendingArticlesCallback(id)
  const setTrendingItems = useSetAtom(useTrendingArticlesAtom(id))

  useEffect(() => {
    if (tab === TAB_TRENDING) {
      loadTrendingArticle()
    } else {
      setTrendingItems([])
    }
  }, [loadTrendingArticle, setTrendingItems, tab])

  return (
    <>
      <Section grid className='md:gap-y-4'>
        <Header data={data} id={id} />
        {tab !== TAB_TRENDING && view === VIEW_LIST && (
          <ArticlesList page={page} articles={items} />
        )}
        {tab !== TAB_TRENDING && view === VIEW_GRID && (
          <ArticlesGrid
            page={page}
            articles={items}
            showNewsletterSubscription={showNewsletterSubscription}
            newsletter={newsletterSlice}
          />
        )}
        {tab === TAB_TRENDING && (
          <TrendingArticlesList
            id={id}
            showNewsletterSubscription={showNewsletterSubscription}
            newsletter={newsletterSlice}
          />
        )}
      </Section>
      {hasMorePages && tab !== TAB_TRENDING && (
        <LoadMore key={`load-more-${index}`} onAppearInView={loadMore} showGradient={false} />
      )}
    </>
  )
}
