import get from 'lodash/get'

export const SANITY_REF_PATTERN = /^image-([a-f\d]+)-(\d+x\d+)-(\w+)$/

export const parseImageRef = (id) => {
  try {
    const [, assetId, dimensions, format] = SANITY_REF_PATTERN.exec(id)
    const [width, height] = dimensions.split('x').map((v) => parseInt(v, 10))

    return {
      assetId,
      dimensions: { width, height },
      format
    }
  } catch {
    throw new Error(`Could not parse image ID "${id}"`)
  }
}

export const getImageAspect = (image) => {
  if (!image) return
  const { width, height } = getImageDimensions(image)
  return width / height
}

export const getDevicePixelRatio = () => {
  if (typeof window === 'undefined' || !window.devicePixelRatio) {
    return 1
  }
  return Math.round(Math.max(1, window.devicePixelRatio))
}

export const getImageDimensions = (image) => {
  const { asset, crop } = image
  const imageMeta = parseImageRef(asset._id || asset._ref)
  let width = get(asset, ['metadata', 'dimensions', 'width']) || imageMeta.dimensions.width
  let height = get(asset, ['metadata', 'dimensions', 'height']) || imageMeta.dimensions.height
  let top = 0
  let left = 0
  if (crop) {
    top = Math.round(crop.top * height) // Need to use the top and left from the original height and width
    left = Math.round(crop.left * width)
    width = Math.round(width * (1 - (crop.right + crop.left)))
    height = Math.round(height * (1 - (crop.top + crop.bottom)))
  }
  return {
    top,
    left,
    width,
    height
  }
}
