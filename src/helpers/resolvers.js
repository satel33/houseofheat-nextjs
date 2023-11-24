import compact from 'lodash/compact'
import get from 'lodash/get'

function resolveSlug (document) {
  const slug = get(document, ['slug'], get(document, ['current'], document))
  if (slug !== 'home') {
    // home resolves to `/`
    return slug
  }
}

export function getTextFromLink (linkOrPage) {
  return get(linkOrPage, ['text']) || get(linkOrPage, ['page', 'title']) || get(linkOrPage, ['title'])
}

export function resolveInternalLinkUrl (link) {
  if (!link) return ''
  const { _type, pageType, brand, slug, relatedArticle } = link
  if (slug === 'home') return '/'
  if (_type === 'release') {
    return resolveInternalLinkUrl(relatedArticle || {})
  }
  const parts = compact([
    pageType !== 'page' && get(brand, ['slug']),
    resolveSlug(slug)
  ])
  return `/${parts.join('/')}`
}

export function resolveLink (linkOrPage) {
  if (!linkOrPage) return null
  if (linkOrPage.linkType) {
    if (linkOrPage.linkType === 'external') {
      return linkOrPage
    }
    return {
      text: getTextFromLink(linkOrPage),
      url: linkOrPage.page ? resolveInternalLinkUrl(linkOrPage.page) : ''
    }
  }

  return {
    text: get(linkOrPage, ['title']),
    url: resolveInternalLinkUrl(linkOrPage)
  }
}

export const hasLink = (link) => {
  return !!get(resolveLink(link), ['url'])
}
