import dayjs from 'dayjs'
import { forEach } from 'lodash'
import get from 'lodash/get'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import omit from 'lodash/omit'
import getImageBackgroundColor from './getImageBackgroundColor'

function toPlainText (blocks = []) {
  blocks = (blocks && blocks.text) || blocks
  if (!blocks || !blocks.map) {
    return null
  }
  return (
    blocks
      .map(block => {
        // if it's not a text block with children, return nothing
        if (block._type !== 'block' || !block.children) {
          return ''
        }
        // loop through the children spans, and join the text strings
        return block.children.map(child => child.text).join('')
      })
      // join the parapgraphs
      .join('\n')
  )
}

function getContentFromObject (obj, content = []) {
  if (isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      getContentFromObject(obj[i], content)
    }
  } else if (isObject(obj)) {
    if (obj._type === 'portableText') {
      content.push(toPlainText(obj))
    } else if (obj._type === 'richTextSlice') {
      content.push(toPlainText(obj.content))
    } else {
      forEach(obj, value => {
        getContentFromObject(value, content)
      })
    }
  } // else if (isString(obj)) {  }

  return content
}

export default async function transformPage ({ _id, ...doc }) {
  // If there is no theme set, then try and determine the theme color from the image
  const featuredImage = get(doc, ['featuredImages', 0])
  if (!doc.pageTheme && featuredImage) {
    doc.pageTheme = await getImageBackgroundColor(featuredImage, doc)
  }

  return {
    objectID: _id,
    _id,
    ...omit(doc, [
      'relatedArticles',
      'slices',
      'next',
      '_createdAt',
      '_rev',
      '_updatedAt',
      'author'
    ]),
    publishedDateTimestamp: doc.publishedDate ? dayjs(doc.publishedDate).unix() : null,
    content: getContentFromObject(doc.slices).join(' ')
  }
}
