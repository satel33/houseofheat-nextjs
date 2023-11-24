import { parseReleaseDate } from '../../../helpers/dates'
import getImageBackgroundColor from './getImageBackgroundColor'

export default async function transformRelease ({ _id, ...doc }) {
  const date = parseReleaseDate(doc.releaseDate)

  // If there is no theme set, then try and determine the theme color from the image
  if (!doc.pageTheme && doc.featuredImage) {
    doc.pageTheme = await getImageBackgroundColor(doc.featuredImage)
  }

  return {
    objectID: _id,
    _id,
    ...doc,
    releaseDateTimestamp: date.unix()
  }
}
