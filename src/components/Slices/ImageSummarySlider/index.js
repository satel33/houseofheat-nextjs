import Section from '../../Section'

import colors from '../../../theme/colors.cjs'
import { useMemo, useRef } from 'react'
import ThumbnailSlider from './ThumbnailSlider'
import forEach from 'lodash/forEach'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import uniqBy from 'lodash/uniqBy'
import compact from 'lodash/compact'

export default function ImageSummarySlider ({ data, page }) {
  const sliderRef = useRef()
  const { backgroundColor = colors.neutral[500] } = data
  const images = useMemo(() => {
    const getImages = (value, images = []) => {
      if (isArray(value)) {
        forEach(value, o => getImages(o, images))
      }
      if (isObject(value)) {
        if (value._type === 'imageWithMeta') {
          images.push(value)
        } else {
          forEach(value, o => getImages(o, images))
        }
      }
      return images
    }
    return compact(uniqBy([
      ...page.featuredImages,
      ...getImages(page.slices.filter(x => x._type !== 'releaseGridSlice'))
    ]), i => i.asset._id)
  }, [page])

  return (
    <Section noGutter style={{ backgroundColor }}>
      <div className='py-4 md:py-16 px-4 md:px-16'>
        <ThumbnailSlider images={images} instanceRef={sliderRef} />
      </div>
    </Section>
  )
}
