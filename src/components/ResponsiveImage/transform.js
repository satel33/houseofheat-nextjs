import get from 'lodash/get'
import mapValues from 'lodash/mapValues'
import pickBy from 'lodash/pickBy'
import imageUrlBuilder from '@sanity/image-url'
import forEach from 'lodash/forEach'
import {
  getImageAspect,
  parseImageRef,
  getImageDimensions
} from './imageHelper'

export const builder = imageUrlBuilder(null)
  .projectId(process.env.SANITY_PROJECT_ID)
  .dataset(process.env.SANITY_PROJECT_DATASET)

function transformPalette (palette) {
  const schemes = pickBy(palette, { _type: 'sanity.imagePaletteSwatch' })
  return mapValues(schemes, scheme =>
    pickBy(scheme, (value, key) => key !== '_type')
  )
}

const getAspect = (asset, vector, width, targetAspect) => {
  const sourceAspect = get(asset, ['metadata', 'dimensions', 'aspectRatio'])
  const resolvedAspect = targetAspect || sourceAspect
  const needsCrop = !vector && resolvedAspect && resolvedAspect !== sourceAspect
  return {
    width,
    needsCrop,
    aspect: resolvedAspect
  }
}

const addOriginalFilenameToUrl = (url, originalFilename) => {
  if (!originalFilename) return url
  const u = new URL(url)
  u.pathname = `${u.pathname}/${originalFilename}`
  return u.toString()
}

export const MOBILE_WIDTHS = [320, 420, 640, 1024]
const DEFAULT_WIDTHS = [
  320,
  420,
  640,
  1024,
  1200,
  1600,
  1920,
  2560,
  3200,
  7680
]

export default function transform (
  image,
  targetAspect,
  WIDTHS = DEFAULT_WIDTHS
) {
  if (!image || !image.asset) {
    return
  }

  const { asset } = image

  const imageMeta = parseImageRef(asset._id || asset._ref)

  const vector = imageMeta.format === 'svg'

  const hasAlpha = get(asset, ['metadata', 'hasAlpha'])
  const opaque = get(asset, ['metadata', 'isOpaque'])
  const palette = transformPalette(get(image, ['metadata', 'palette']))
  const sizes = []

  const { width, height, top, left } = getImageDimensions(image)

  const sourceAspect = getImageAspect(image)

  const result = {
    sourceAspect,
    hasAlpha,
    opaque,
    vector,
    palette,
    sizes
  }

  let widths = WIDTHS
  // If the image is smaller then the smallest width, then just use the image width
  if (WIDTHS[0] > width) {
    widths = [width]
  }
  const aspects = widths.map(width => ({
    ...getAspect(asset, vector, width, targetAspect || sourceAspect)
  }))

  if (image.alt) {
    result.alt = image.alt
  }
  if (image.caption) {
    result.title = image.caption
  }
  if (image.attribution) {
    result.credit = image.attribution
  }
  if (image.hotspot) {
    const { _type: type, ...hotspot } = image.hotspot
    result.hotspot = {
      type,
      ...hotspot
    }
  }
  if (image.crop) {
    const { _type: type, ...crop } = image.crop
    result.crop = {
      type,
      ...crop
    }
  }

  if (vector) {
    sizes.push({
      width,
      height,
      url: addOriginalFilenameToUrl(
        builder.image(image.asset).url(),
        image.asset.originalFilename
      )
    })
  } else {
    const maxWidth = width
    let resizeBuilder = builder.image(image.asset)

    forEach(aspects, ({ needsCrop, aspect, width: w }) => {
      if (w <= maxWidth) {
        if (image.crop) {
          resizeBuilder = resizeBuilder.rect(left, top, width, height)
        }
        if (needsCrop) {
          if (image.hotspot) {
            resizeBuilder = resizeBuilder
              .fit('crop')
              .crop('focalpoint')
              .focalPoint(image.hotspot.x, image.hotspot.y)
          } else {
            resizeBuilder = resizeBuilder.fit('min')
          }
        }
        let sizeBuilder = resizeBuilder.width(w)
        sizeBuilder = sizeBuilder.height(Math.round(w / aspect))
        sizeBuilder = sizeBuilder.auto('format')

        const size = {
          width: w,
          height: Math.round(w / aspect),
          url: addOriginalFilenameToUrl(
            sizeBuilder.url(),
            image.asset.originalFilename
          )
        }

        sizes.push(size)
      }
    })
  }

  return result
}
