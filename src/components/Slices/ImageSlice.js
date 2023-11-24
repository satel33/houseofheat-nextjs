import { useMemo } from 'react'
import screens from '../../theme/screens.cjs'
import ImageCaption from '../ImageCaption'
import ResponsiveImage from '../ResponsiveImage'
import Section from '../Section'

export default function ImageSlice ({ data, page }) {
  const { fullWidth } = data
  const classes = fullWidth
    ? 'col-span-12'
    : 'col-start-1 md:col-start-5 col-end-13'
  const className = useMemo(() => {
    const nextSlice = page.slices?.[page.slices?.indexOf(data) + 1]
    return nextSlice?._type === 'imageSlice'
      ? 'mb-4 md:mb-20'
      : 'mb-16 md:mb-20'
  }, [data, page])

  return (
    <Section grid noGutter={fullWidth} noBottomMargin className={className}>
      <div className={classes}>
        <ResponsiveImage
          image={data.image}
          showPreview
          imageSizes={
            fullWidth
              ? '100vw'
              : `(max-width: ${screens.md}) 100vw, calc(66vw - 3rem)`
          }
        />
        <ImageCaption image={data.image} />
      </div>
    </Section>
  )
}
