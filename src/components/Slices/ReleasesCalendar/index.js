import dayjs from 'dayjs'
import { useAtomValue } from 'jotai'
import groupBy from 'lodash/groupBy'
import { useMemo } from 'react'
import { getNewYorkDate } from '../../../helpers/dates'

import { useReleasesSlice, VIEW_GRID, VIEW_LIST } from '../../../store/articles'
import Advertisement from '../../Advertisement'
import LoadMore from '../../LoadMore'
import Section from '../../Section'
import Heading from '../../Typography/Heading'
import EmptyResults from './EmptyResults'
import Header from './Header'
import ReleasesGrid from './ReleasesGrid'
import ReleasesList from './ReleasesList'

export default function ReleasesCalendar ({ page, data }) {
  const id = page._id + data.key
  const { emptyResultsTitle, emptyResultsCopy } = data
  const { baseAtom, actions } = useReleasesSlice(id)
  const { items, index, totalPages, view, order } = useAtomValue(baseAtom)
  const { loadMore } = actions
  const hasMorePages = totalPages > index + 1

  // Grouped releases (will return an object {'2022-05': releasesArrayForMay, ...etc })
  const releasesGroupedByMonth = useMemo(
    () =>
      groupBy(items, release =>
        getNewYorkDate(release.releaseDate)
          .startOf('month')
          .format('YYYY-MM')
      ),
    [items]
  )

  // Sections titles array (sorted depending on the `showPastReleases` value)
  const monthSections = useMemo(
    () =>
      Object.keys(releasesGroupedByMonth).sort((a, b) => {
        if (order === 'desc') {
          return a > b ? -1 : 1
        }

        return a > b ? 1 : -1
      }),
    [releasesGroupedByMonth, order]
  )

  return (
    <>
      <Section grid className='gap-y-0 md:gap-y-0'>
        <Header id={id} page={page} showBrandFilter={!data.hideBrandFilter} />
        <div className='col-span-full'>
          {monthSections.length === 0 && (
            <EmptyResults title={emptyResultsTitle} copy={emptyResultsCopy} className='mt-10 md:mt-16' />
          )}
          {monthSections.map(month => {
            const [y, m] = month.split('-')
            const titles = dayjs()
              .set('year', y)
              .set('month', m - 1)
              .format('MMMM YYYY')
              .split(' ')

            return (
              <section key={month}>
                <header className='flex items-center justify-between mb-4 md:mb-6 mt-10 md:mt-16'>
                  {titles.map((title, i) => (
                    <Heading key={i} as='h4'>
                      {title}
                    </Heading>
                  ))}
                </header>
                {view === VIEW_LIST && (
                  <>
                    <ReleasesList page={page} releases={releasesGroupedByMonth[month]} />
                    {releasesGroupedByMonth[month].length >= 4 && (
                      <Advertisement className='my-10 md:my-16' bottomMargin={false} background />
                    )}
                  </>
                )}
                {view === VIEW_GRID && (
                  <>
                    <ReleasesGrid page={page} releases={releasesGroupedByMonth[month]} />
                    {releasesGroupedByMonth[month].length >= 5 && (
                      <Advertisement className='my-10 md:my-16' bottomMargin={false} background />
                    )}
                  </>
                )}
              </section>
            )
          })}
        </div>
      </Section>
      {hasMorePages && (
        <LoadMore onAppearInView={loadMore} showGradient={false} />
      )}
    </>
  )
}
