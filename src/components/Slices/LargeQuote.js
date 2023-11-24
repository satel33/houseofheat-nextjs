import cn from 'clsx'
import first from 'lodash/first'
import uniq from 'lodash/uniq'
import compact from 'lodash/compact'
import Section from '../Section'
import Mono from '../Typography/Mono'

export default function LargeQuote ({ data, page }) {
  const { quote } = data
  const { releases } = page

  const brand = page.brand || first(uniq([...releases.map(r => r.brand), page.brand]))
  const colors = compact(uniq(releases.map(r => r.color)))
  const codes = compact(uniq(releases.map(r => r.styleCode)))
  const models = compact(uniq([...releases.map(r => r.model?.title), page.model?.title]))

  return (
    <Section
      grid
      noBottomMargin
      className={cn('py-16 md:py-20, text-[3.2rem] md:text-[7rem] leading-[.9em] !gap-y-10')}
    >
      <span className='col-span-1 md:col-span-3'>“</span>
      <blockquote className='font-serif col-span-10 md:col-span-6 mb-4 md:mb-10'>{quote}</blockquote>
      <span className='col-span-1 md:col-span-3 self-end justify-self-end'>”</span>

      {brand && <Mono className='col-start-2 col-span-2 md:col-start-4 md:col-span-1 mb-20'>{brand?.title}</Mono>}
      {models && <Mono className='col-span-2 md:col-span-1'>{models}</Mono>}
      {colors && <Mono className='col-span-2 col-start-8 md:col-span-1'>
        {colors}
        {codes}
      </Mono>}
    </Section>
  )
}
