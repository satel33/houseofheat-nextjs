import gsap from 'gsap'
import { useAtom, useAtomValue } from 'jotai'
import toArray from 'lodash/toArray'
import { useCallback, useEffect, useRef, useState } from 'react'
import useReleasePageTitle from '../../hooks/useReleasePageTitle'
import { settingsAtom } from '../../store/content'
import Rating from '../ArticleTile/Rating'
import Button from '../Button'
import Section from '../Section'
import { MonoSmall } from '../Typography/Mono'
import ConfirmRatingButton from './ConfirmRatingButton'
import Loading from './Loading'
import {
  currentRatingState,
  isRateSneakerDialogOpen,
  isSubmittingRating
} from './rateSneakerState'
import RatingImages from './RatingImages'
import RatingSlider from './RatingSlider'
import useCurrentUsersRating from './useCurrentUsersRating'

export default function RateSneaker ({ page }) {
  const [open, setOpen] = useAtom(isRateSneakerDialogOpen)
  const submitting = useAtomValue(isSubmittingRating)
  const [currentRating, setCurrentRating] = useAtom(currentRatingState)
  const confirmRatingRef = useRef()

  const settings = useAtomValue(settingsAtom)
  const [ratingImages, setRatingImages] = useState()
  const [loadingPercent, setLoadingPercent] = useState(10)
  const loadingRef = useRef()
  const contentRef = useRef()
  const ratingImagesRef = useRef()
  const [expandImage, setExpandImage] = useState()

  // Gets the current users rating and sets the rating value on the slider
  const { rating: existingRating } = useCurrentUsersRating(page)

  const onDragStart = useCallback(() => {
    setExpandImage(false)
  }, [])

  const onDragEnd = useCallback(() => {
    setExpandImage(true)
  }, [])

  const onSliderClicked = useCallback(() => {
    setExpandImage(true)
  }, [])

  useEffect(() => {
    if (open) setExpandImage(false)
  }, [open])

  const releasePage =
    page.pageType === 'release' ? page : settings.toolbar.releasePage

  const onClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  useEffect(() => {
    setRatingImages(
      settings.rating.ratings.map(({ file }, i) => {
        const r = {}
        const image = new window.Image()
        image.src = file.asset.url
        image.addEventListener('load', () => {
          setLoadingPercent(
            percent => (percent += 90 * (1 / settings.rating.ratings.length))
          )
          r.width = image.width
          r.height = image.height
        })
        r.image = image
        r.fromValue = i / settings.rating.ratings.length
        r.toValue = (i + 1) / settings.rating.ratings.length
        return r
      })
    )
  }, [settings.rating])

  useEffect(() => {
    if (loadingPercent >= 100) {
      gsap.to(loadingRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'sine.out'
      })

      const elements = [
        ...toArray(contentRef.current.children),
        confirmRatingRef.current
      ]
      gsap.to(elements, {
        opacity: 1,
        duration: 0.2,
        stagger: 0.1,
        ease: 'sine.out'
      })
      gsap.to(ratingImagesRef.current, {
        opacity: 0.5,
        duration: 0.2,
        stagger: 0.1,
        ease: 'sine.out'
      })
    } else {
      gsap.set(ratingImagesRef.current, { opacity: 0 })
    }
  }, [loadingPercent])

  const onRatingChange = useCallback(rating => {
    setCurrentRating(rating)
  }, [setCurrentRating])

  useEffect(() => {
    setCurrentRating(existingRating)
  }, [existingRating, setCurrentRating])

  const title = useReleasePageTitle(page)

  return (
    <>
      <Loading percent={loadingPercent} ref={loadingRef} />
      <RatingImages
        images={ratingImages}
        rating={currentRating}
        expandImage={expandImage}
        ref={ratingImagesRef}
      />
      <div
        className='flex flex-col justify-center h-full w-full'
        ref={contentRef}
      >
        <Section
          as='header'
          className='flex-grow-0 flex justify-between my-5'
          width='w-full'
          noBottomMargin
        >
          <MonoSmall>01°</MonoSmall>
          <MonoSmall className='flex items-center'>
            <Rating article={page} />
            <span className='block ml-2'>Avg Rating</span>
          </MonoSmall>
          <MonoSmall>100°</MonoSmall>
        </Section>
        <Section noBottomMargin className='flex-grow relative opacity-0' width='w-full'>
          <RatingSlider
            value={currentRating}
            onValueChanged={onRatingChange}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            onSliderClicked={onSliderClicked}
          />
        </Section>
        <footer className='w-full flex-grow-0 z-dialog'>
          <ConfirmRatingButton className='opacity-0' page={page} rating={currentRating} ref={confirmRatingRef} />
          <Section noBottomMargin>
            <MonoSmall className='flex md:grid md:grid-cols-3 w-full my-5 justify-between items-center'>
              <span className='justify-self-start hidden md:block grow-0 shrink-0'>
                {releasePage?.categories?.[0]?.title}
              </span>
              <span className='justify-self-center grow shrink'>
                {title}
              </span>
              <Button
                onClick={onClose}
                className='justify-self-end border border-current border-solid grow-0 shrink-0 hover:bg-neutral-700'
                disabled={submitting}
              >
                Close
              </Button>
            </MonoSmall>
          </Section>
        </footer>
      </div>
    </>
  )
}
