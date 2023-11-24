import gsap from 'gsap'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebouncedCallback } from '../../../hooks/useDebouncedCallback'
import useWindowResize from '../../../hooks/useWindowResize'
import Button from '../../Button'
import RichContent from '../../RichContent'
import Section from '../../Section'
import Heading from '../../Typography/Heading'
import Mono from '../../Typography/Mono'

export default function TagPageHero ({ data }) {
  const { title, description } = data
  const [showMore, setShowMore] = useState()
  const [hasMoreLines, setHasMoreLines] = useState()
  const contentRef = useRef()

  useEffect(() => {
    if (showMore === undefined) return
    const currentHeight = contentRef.current.getBoundingClientRect().height
    contentRef.current.style.display = showMore ? 'block' : '-webkit-box'
    contentRef.current.style.height = 'auto'
    const targetHeight = contentRef.current.getBoundingClientRect().height
    gsap.fromTo(contentRef.current,
      { height: currentHeight },
      {
        height: targetHeight,
        duration: 0.2,
        ease: 'sine.out',
        onComplete: () => {
          contentRef.current.style.height = 'auto'
          if (!showMore) {
            contentRef.current.style.display = '-webkit-box'
          }
        }
      })
  }, [showMore])

  const toggleMore = useCallback(() => {
    setShowMore(v => !v)
  }, [])

  useWindowResize(useDebouncedCallback(() => {
    if (contentRef.current) {
      setHasMoreLines(contentRef.current.clientHeight !== contentRef.current.scrollHeight)
    }
  }, 200, [showMore]), true, true)

  return (
    <Section
      grid
      className='items-end pt-40 xxs:pt-52 xs:pt-60 md:pt-64 md:mb-24'
    >
      <Heading className='col-span-full lg:col-span-7 font-sans' tagStyle='h0'>
        {title}
      </Heading>
      <div className='col-span-full md:col-span-5 relative'>
        <div className='overflow-hidden'>
          <RichContent
            content={description}
            className='overflow-auto w-[calc(100%+40px)] pr-[40px] pointer-events-none max-w-none'
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical'
            }}
            ref={contentRef}
          />
        </div>
        {hasMoreLines && <Button className='absolute top-full mt-2 sm:mt-4' withBorder withHover onClick={toggleMore}><Mono>{showMore ? 'Show Less' : 'Read More'}</Mono></Button>}
      </div>
    </Section>
  )
}
