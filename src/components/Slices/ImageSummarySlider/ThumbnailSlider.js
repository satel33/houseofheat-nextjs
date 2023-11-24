import cn from 'clsx'
import { useKeenSlider } from 'keen-slider/react'
import { useResizeDetector } from 'react-resize-detector'
import { isDesktop } from '../../../helpers/screens'
import useComposeRefs from '../../../hooks/useComposeRefs'
import screens from '../../../theme/screens.cjs'
import ResponsiveImage from '../../ResponsiveImage'

function ThumbnailPlugin (mainRef) {
  return slider => {
    function removeActive () {
      slider.slides.forEach(slide => {
        slide.style.opacity = 1
      })
    }
    function addActive (idx) {
      slider.slides[idx].style.opacity = 0.5
    }

    function addClickEvents () {
      slider.slides.forEach((slide, idx) => {
        slide.addEventListener('click', () => {
          if (mainRef.current) mainRef.current.moveToIdx(idx)
        })
      })
    }

    slider.on('created', () => {
      if (!mainRef.current) return
      addActive(slider.track.details.rel)
      addClickEvents()
      mainRef.current.on('animationStarted', main => {
        removeActive()
        const next = main.animator.targetIdx || 0
        addActive(main.track.absToRel(next))
        slider.moveToIdx(next)
      })
    })
  }
}

export default function ThumbnailSlider ({ className, images }) {
  const [sliderElementRef, instanceRef] = useKeenSlider({
    loop: true
  })
  const [thumbnailRef] = useKeenSlider(
    {
      initial: 0,
      loop: false,
      slides: {
        perView: 'auto',
        spacing: 10
      },
      breakpoints: {
        [`(min-width: ${screens.md})`]: {
          initial: 0,
          loop: false,
          slides: {
            perView: 'auto',
            spacing: 20
          }
        }
      }
    },
    [ThumbnailPlugin(instanceRef)]
  )

  const { width, ref } = useResizeDetector()
  const composedThumbnailRefs = useComposeRefs(ref, thumbnailRef)

  return (
    <>
      <div ref={sliderElementRef} className='keen-slider pb-4 md:pb-8'>
        {images.map((image, i) => (
          <div key={i} className='keen-slider__slide'>
            <ResponsiveImage
              image={image}
              contain
              aspect={1.6}
              imageSizes={`(max-width: ${screens.md}) 100vw, calc(100vw - 8rem)`}
            />
          </div>
        ))}
      </div>
      <div
        ref={composedThumbnailRefs}
        className={cn('keen-slider thumbnail h-[42px] md:h-[68px]', className)}
      >
        {images.map((image, i) => {
          const elementWidth =
            (width && !isDesktop(width) ? 42 : 68) *
            image.asset.metadata.dimensions.aspectRatio
          return (
            <div
              key={i}
              className='keen-slider__slide transition-opacity duration-150 h-full'
              style={{ maxWidth: elementWidth, minWidth: elementWidth }}
            >
              <ResponsiveImage
                image={image}
                contain={false}
                className='cursor-pointer'
                imageSizes={`(max-width: ${screens.md}) 100px, 200px`}
              />
            </div>
          )
        })}
      </div>
    </>
  )
}
