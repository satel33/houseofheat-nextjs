import { PAGE_REFERENCE_PROJECTION } from '../../lib/queries/projections'

export default async function resolveRelatedArticles (
  input,
  referencesResolver
) {
  const { page } = input
  if (page?._type === 'page' && (page?.pageType === 'release' || page?.pageType === 'culture')) {
    referencesResolver.addQuery('relatedArticles', `
    *[!(_id in path('drafts.**'))
      && _id != '${page._id}'
      && pageType == '${page.pageType}'
      ${page.brand?._id ? `&& brand._ref == '${page.brand._id}'` : ''}
      ${page.model?._id ? `&& model._ref == '${page.model._id}'` : ''}
    ] | order(publishedDate desc) [0...4]
      {
        ${PAGE_REFERENCE_PROJECTION}
      }
    `,
    (key, results) => {
      page.relatedArticles = results
    }
    )
  }
}
