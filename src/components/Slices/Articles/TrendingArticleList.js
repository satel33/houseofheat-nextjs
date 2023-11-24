import { useAtomValue } from 'jotai'
import isEmpty from 'lodash/isEmpty'
import Newsletter from '../Newsletter'
import ArticlesList from './ArticlesList'
import { useTrendingArticlesAtom, useTrendingArticlesLoadingAtom } from './articlesState'

export default function TrendingArticlesList ({ id, newsletter }) {
  const items = useAtomValue(useTrendingArticlesAtom(id))
  const loading = useAtomValue(useTrendingArticlesLoadingAtom(id)) || isEmpty(items)
  return (
    <>
      <ArticlesList articles={items} loading={loading} />
      <Newsletter data={newsletter} className='mt-16 mb-0 -mx-4 md:-mx-6 col-span-full' />
    </>
  )
}
