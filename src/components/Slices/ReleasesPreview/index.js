import cn from 'clsx'
import { useAtomValue } from 'jotai'
import { useEffect, useMemo, useRef, useState } from 'react'

import isEmpty from 'lodash/isEmpty'
import { useReleasesSlice } from '../../../store/articles'
import { settingsAtom } from '../../../store/content'
import RichContent from '../../RichContent'
import Section from '../../Section'
import Heading from '../../Typography/Heading'
import Header from './Header'
import Release from './Release'
import ReleaseImages from './ReleaseImages'

export default function ReleasesPreviewSlice ({ data, page }) {
  const { labels } = useAtomValue(settingsAtom)
  const bottomShadowRef = useRef()
  const scrollContainerRef = useRef()
  const id = page._id + data.key
  const { showBrandFilter = true } = data
  const [selectedReleaseIndex, setSelectedReleaseIndex] = useState(0)

  const { baseAtom } = useReleasesSlice(id)
  const { items, loading } = useAtomValue(baseAtom)

  const empty = isEmpty(items)

  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current
      const onScroll = () => {
        const scrollLimit = scrollContainer.scrollHeight - scrollContainer.getBoundingClientRect().height
        const shadowHeight = bottomShadowRef.current.getBoundingClientRect().height
        const offset = scrollLimit - shadowHeight
        // This will move the gradient down when it reaches the bottom of the scroll container
        bottomShadowRef.current.style.transform = `translateY(${Math.max(0, scrollContainer.scrollTop - offset)}px)`
      }
      scrollContainer.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
      return () => {
        scrollContainer.removeEventListener('scroll', onScroll)
      }
    }
  }, [])

  const viewAllLink = useMemo(() => {
    if (page._type === 'brand') {
      return {
        linkType: 'internal',
        title: 'View All',
        page: { slug: `${page.slug}-release-dates` }
      }
    }
    return data.link
  }, [data, page])

  if (isEmpty(data.items)) return null

  return (
    <>
      <Section grid noBottomMargin className='mb-4 md:mb-10'>
        <Header title={data.title} link={viewAllLink} id={id} showBrandFilter={showBrandFilter} />
      </Section>
      <Section grid className='md:gap-y-4 relative'>
        {/* No results (design to come!) */}
        {empty && (
          <>
            <div className='hidden relative md:flex md:col-span-7 transition-colors items-center p-20 pt-[62%] bg-gray-300 opacity-20' />
            <div className='relative col-span-full md:col-span-5 md:aspect-[547.1/550] md:-mr-2 bg-gray-300 opacity-20' />
            <div className='md:absolute col-span-full flex flex-col items-center justify-center inset-0'>
              <Heading as='h4'>{labels.releasesEmptyResultsTitle}</Heading>
              {labels.releasesEmptyResultsCopy && (
                <RichContent content={labels.releasesEmptyResultsCopy} />
              )}
            </div>
          </>
        )}
        {!empty && (
          <>
            <ReleaseImages
              releases={items}
              selectedIndex={selectedReleaseIndex}
            />
            <div className='relative col-span-full md:col-span-5 md:aspect-[547.1/550] md:-mr-2 overflow-hidden'>
              <div className='small-scrollbar h-full overflow-y-auto md:pr-2' ref={scrollContainerRef}>
                <ul>
                  {items.map((release, i) => (
                    <li key={release._id}>
                      <Release
                        className={cn(
                          i === 0 && 'border-t border-neutral-500 md:border-t-0',
                          i !== items.length - 1 && 'border-b border-neutral-500',
                          i > 4 && 'hidden md:block'
                        )}
                        isSelected={selectedReleaseIndex === i}
                        onMouseEnter={() => setSelectedReleaseIndex(i)}
                        release={release}
                      />
                    </li>
                  ))}
                </ul>
                <div
                  className='absolute bottom-0 left-0 right-0 h-32 mr-[4px] pointer-events-none hidden md:block'
                  ref={bottomShadowRef}
                  style={{
                    background:
                      'linear-gradient(rgba(255,255,255, 0) 0%, rgba(255,255,255, 1) 100%)'
                  }}
                />
              </div>
              <div
                className={cn(
                  'absolute h-full w-full top-0 left-0 bg-white bg-opacity-0.5 pointer-events-none opacity-0',
                  { 'opacity-80 pointer-events-auto': loading }
                )}
              />
            </div>
          </>
        )}
      </Section>
    </>
  )
}
