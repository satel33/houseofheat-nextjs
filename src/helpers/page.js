import flatten from 'lodash/flatten'
import forEach from 'lodash/forEach'
import isEmpty from 'lodash/isEmpty'
import colors from '../theme/colors.cjs'

export function isRelease (page) {
  return page._type === 'release'
}

export function getReleaseDate (page) {
  return isRelease(page) ? page.releaseDate : page.releases?.[0]?.releaseDate
}

export function getReleaseDateLabel (page) {
  return isRelease(page)
    ? page.releaseDateLabel
    : page.releases?.[0]?.releaseDateLabel
}

export function getImages (page) {
  const { featuredImages, featuredImage } = page || {}
  return featuredImages ?? (featuredImage ? [featuredImage] : null)
}

export function getPageThemeColor (page) {
  const images = getImages(page)

  return (
    page?.pageTheme ??
    images?.[0].asset?.metadata?.palette?.dominant?.background ??
    colors.defaultPageTheme
  )
}

export function getPageLink (page) {
  return isRelease(page) ? page.relatedArticle : page
}

export function hasBuyNowLinks (pageOrRelease) {
  if (!pageOrRelease) return false
  if (pageOrRelease._type === 'release') {
    return !isEmpty(pageOrRelease.shoppingButtons)
  }
  if (pageOrRelease._type === 'page') {
    return !isEmpty(flatten(pageOrRelease.releases?.map(x => x.shoppingButtons)))
  }
}

const portableTextToPlainText = (text, deep = false) => {
  if (deep) {
    let result = ''
    forEach(
      (text || []).filter(x => x._type === 'block'),
      block => {
        result += block.children
          .filter(child => child._type === 'span')
          .map(span => span.text)
          .join('')
        result += portableTextToPlainText(block.children, true)
      }
    )
    return result
  } else {
    const block = (text || []).find(block => block._type === 'block')
    if (block) {
      return block.children
        .filter(child => child._type === 'span')
        .map(span => span.text)
        .join('')
    }
  }
}

const MAX_DESCRIPTION_LENGTH = 160

export function getMetaDescription (page, seo, maxCharacters = MAX_DESCRIPTION_LENGTH) {
  let description = seo?.meta_description || page?.excerpt
  if (!description) {
    const richtextContent = page?.slices?.find(({ _type }) => _type === 'richTextSlice')?.content
    if (richtextContent) {
      let firstLine = portableTextToPlainText(richtextContent)?.split('\n')?.[0]
      if (firstLine) {
        if (firstLine.length > maxCharacters) {
          const words = firstLine.split(' ')
          firstLine = ''
          for (let i = 0; i < words.length; i++) {
            firstLine += words[i] + ' '
            if (firstLine.length > (maxCharacters - 10)) break // We leave a little space for the word and the […]
          }
          firstLine = `${firstLine.trim()} […]`
        }
      }
      description = firstLine
    }
  }

  return description
}
