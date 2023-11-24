import cn from 'clsx'
import { useMemo } from 'react'
import { isColorDark } from '../../helpers/colors'
import RichContent from '../RichContent'
import Section from '../Section'

const slicesToRemoveMarginsOn = [
  'imageSlice',
  'imagesGridSlice',
  'imagesSliderSlice'
]

const shouldRemoveMargins = (adjacentSlice, next) => {
  if (adjacentSlice) {
    if (slicesToRemoveMarginsOn.includes(adjacentSlice._type)) return true
    if (
      next &&
      adjacentSlice._type === 'richTextSlice' &&
      adjacentSlice.backgroundColor
    ) return true
  }
  return false
}

export default function RichText ({ data, page, isFirst }) {
  const { content, backgroundColor } = data
  const margins = useMemo(() => {
    if (isFirst) return 'mt-[12rem] md:mt-[18rem]'
    if (!backgroundColor) return 'mb-16 md:mb-20'
    let margins = ''
    const index = page.slices.indexOf(data)
    const nextSlice = page.slices[index + 1]
    const previousSlice = page.slices[index - 1]
    if (!shouldRemoveMargins(nextSlice, true)) {
      margins += 'mb-16 md:mb-20'
    }
    if (shouldRemoveMargins(previousSlice)) {
      margins += '-mt-16 md:-mt-20'
    }
    return margins
  }, [page, data, backgroundColor, isFirst])
  return (
    <Section
      grid
      style={{ backgroundColor }}
      noBottomMargin
      className={cn(backgroundColor && 'py-16 md:py-20', margins)}
    >
      <RichContent
        className={cn(
          'col-span-full md:col-start-7 md:col-end-12',
          isColorDark(backgroundColor) && 'prose-invert'
        )}
        content={content}
      />
    </Section>
  )
}
