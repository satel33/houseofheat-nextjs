import cn from 'clsx'

import Advertisement from '../Advertisement'
import ImageCaption from '../ImageCaption'
import ResponsiveImage from '../ResponsiveImage'
import Section from '../Section'

// Define the grid item classes statically
// Note: Some classes are probably not required, but better be more explicit since the layout might change later...
const classes = [
  'col-span-full md:col-start-1 md:col-span-full',
  'col-span-full md:col-start-1 md:col-span-7',
  'col-span-full md:col-start-14 md:col-span-5',
  'col-span-full md:col-start-1 md:col-span-5',
  'col-span-full md:col-start-12 md:col-span-7',
  'col-span-full md:col-start-5 md:col-span-6 md:-mt-28 z-1', // Check if the negative margin doesn't add more trouble...
  'col-span-full md:col-start-1 md:col-span-10',
  'col-span-full md:col-start-12 md:col-span-7'
]

const Item = ({ fullWidth, item, page, index }) => {
  return (
    <div className={cn('relative', fullWidth ? 'col-span-full' : classes[index % classes.length])}>
      {item._type === 'advertisement' && (
        <Advertisement
          key={item._id}
          data={item}
          bottomMargin={false}
          page={page}
        />
      )}
      {item._type !== 'advertisement' && (
        <div>
          <ResponsiveImage key={item._id} image={item} showPreview />
          <ImageCaption image={item} />
        </div>
      )}
    </div>
  )
}

export default function ImagesGrid ({ data, page, index, pageHasFooter }) {
  const { images: items } = data
  const isLastSlice = page?.slices.length === (index + 1)

  return (
    <Section className='grid gap-4 md:gap-6 grid-cols-12 md:grid-cols-18 md:gap-y-20'>
      {items.map((item, i) => {
        const isFullWidth = item._type === 'advertisement' && item.size !== 'tile'
        if ((i + 1) === items.length && isLastSlice && pageHasFooter && item._type === 'advertisement') return null
        return (
          <Item key={i} index={i} item={item} page={page} fullWidth={isFullWidth} />
        )
      })}
    </Section>
  )
}
