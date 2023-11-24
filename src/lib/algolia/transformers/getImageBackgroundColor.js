import pixels from 'image-pixels'

const rgbToHex = (r, g, b) => {
  const componentToHex = (c) => {
    const hex = c.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

export default async function getImageBackgroundColor (image, doc) {
  // If there is no theme set, then try and determine the theme color from the image
  try {
    const imageUrl = `${image.asset.url}?rect=1,1,1,1`
    const { data } = await pixels(imageUrl)
    return rgbToHex(...data)
  } catch (e) {
    console.error('Error trying to get image color for page theme', doc?._id, doc?.title)
  }
}
