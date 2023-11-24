import cn from 'clsx'
import gsap from 'gsap'
import { forwardRef, useEffect, useRef } from 'react'
import { useWindowSize } from 'react-use'
import { isDesktop } from '../../helpers/screens'

const getImageCoverDimensions = image => {
  const containerHeight = window.innerHeight
  const containerWidth = window.innerWidth
  const imgWidth = image.offsetWidth
  const imgHeight = image.offsetHeight

  const imgRatio = imgHeight / imgWidth
  const containerRatio = containerHeight / containerWidth

  if (containerRatio > imgRatio) {
    const height = containerHeight
    const scale = height / imgHeight
    const width = Math.round(containerHeight / imgRatio)
    return {
      width,
      height,
      scale
    }
  } else {
    const width = containerWidth
    const scale = width / imgWidth
    const height = Math.round(containerWidth * imgRatio)
    return {
      width,
      height,
      scale
    }
  }
}

const RatingImages = forwardRef(
  ({ images, rating, className, expandImage }, ref) => {
    const imageRef = useRef()
    const currentImageRef = useRef()

    const updateImageSize = () => {
      const image = currentImageRef.current
      if (image && imageRef.current.src !== image.image.src) {
        imageRef.current.src = image.image.src
      }
      if (isDesktop()) {
        imageRef.current.style.height = 'calc(100vh - 20rem)'
        imageRef.current.style.width = 'auto'
      } else {
        imageRef.current.style.height = 'auto'
        imageRef.current.style.width = '80vw'
      }
    }

    useEffect(() => {
      if (imageRef.current) {
        const image = images?.find(({ fromValue, toValue }) => {
          return rating >= fromValue && rating <= toValue
        })
        currentImageRef.current = image
        updateImageSize()
      }
    }, [images, rating])

    const { width, height } = useWindowSize()
    useEffect(() => {
      updateImageSize()
    }, [width, height])

    useEffect(() => {
      const tl = gsap.timeline()
      if (expandImage) {
        const { scale } = getImageCoverDimensions(imageRef.current, ref.current)
        tl.to(imageRef.current, { scale, duration: 4, ease: 'expo.out' }, 0.5)
      } else {
        tl.to(imageRef.current, {
          scale: 1,
          duration: 0.5,
          ease: 'sine.inOut'
        })
      }
      return () => {
        tl.kill()
      }
    }, [expandImage, ref])

    if (rating === null) return null

    return (
      <div
        className={cn(
          className,
          'absolute inset-0 flex justify-center items-center opacity-50 pointer-events-none -z-1 overflow-hidden'
        )}
        ref={ref}
      >
        <img ref={imageRef} alt='Rating GIF' />
      </div>
    )
  }
)

export default RatingImages
