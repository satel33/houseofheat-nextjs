import cn from 'clsx'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'

import Flame from './flame.svg'

export default function Rating ({
  article,
  showEmptyRating,
  className,
  showProgressBar,
  showFlame = true,
  isHovering = false
}) {
  const progressRef = useRef()
  const ratingTextRef = useRef()
  const ratingObject = article?.rating || article?.relatedArticle?.rating

  const rating = ratingObject?.averageRating || ratingObject?.initialRating || undefined

  const ratingText =
    rating === undefined
      ? '--'
      : `${(Math.round(rating * 10) / 10).toFixed(2)}°`

  useEffect(() => {
    if (!isHovering) return
    if (rating === undefined) return
    if (!ratingTextRef.current) return

    const counter = { value: 0 }
    gsap.to(counter, {
      value: rating,
      duration: 0.6,
      ease: 'power3.inOut',
      onUpdate: () => {
        if (!ratingTextRef.current) return
        ratingTextRef.current.innerText = `${(Math.round(counter.value * 10) / 10).toFixed(2)}°`
      }
    })

    if (progressRef.current) {
      gsap.fromTo(progressRef.current, { scaleX: 0 }, {
        scaleX: 1,
        transformOrigin: '0 0',
        duration: 0.6,
        ease: 'power3.inOut'
      })
    }
  }, [isHovering, rating])

  if (ratingObject && ratingObject.disabled) return null
  if (rating === undefined && !showEmptyRating) return null

  return (
    <>
      {showFlame && (
        <Flame style={{ width: 8, height: 11 }} className='mr-2 block' />
      )}
      <span className={cn(className)} ref={ratingTextRef} style={{ width: '4em' }}>{ratingText}</span>
      {showProgressBar && (
        <span className='block h-[0.625rem] border-[1px] w-10 ml-2 border-current overflow-hidden'>
          <span
            ref={progressRef}
            className='block bg-current h-[0.625rem]'
            style={{ width: `${rating}%` }}
          />
        </span>
      )}
    </>
  )
}
