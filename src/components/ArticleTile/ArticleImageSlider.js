import cn from 'clsx'

import { getPageLink } from '../../helpers/page'
import Link from '../Link'
import ResponsiveImage from '../ResponsiveImage'
import Slider from '../Slider'

const Slide = ({
  article,
  className,
  linkClassName,
  imageClassName,
  slideClassName,
  image,
  onClick,
  asLink = true,
  ...rest
}) => {
  const link = getPageLink(article)

  return (
    <Link
      link={asLink ? link : null}
      className={cn(className, linkClassName, 'block relative w-full')}
      showText={false}
      onClick={onClick}
      prefetch={false}
      scroll={false}
    >
      <div className={cn(slideClassName, 'relative')}>
        {image && <ResponsiveImage
          className='h-full'
          image={image}
          contain={!image.cover}
          imageClassName={imageClassName}
          fallbackAlt={article?.title}
          {...rest}
        />}
      </div>
    </Link>
  )
}

export default function ArticleImageSlider ({
  className,
  imageClassName,
  images,
  backgroundColor,
  preload,
  cursorSize,
  ...rest
}) {
  if (!images) return null
  if (images.length === 1) {
    return (
      <div className={className}>
        <Slide
          {...rest}
          className={className}
          image={images[0]}
          style={{ backgroundColor }}
          preload={preload}
          imageClassName={cn(images[0].className, imageClassName)}
        />
      </div>
    )
  }

  return (
    <Slider
      className={className}
      style={{ backgroundColor }}
      cursorSize={cursorSize}
    >
      {images.map((image, i) => (
        <Slide
          key={i}
          {...rest}
          image={image}
          preload={i === 0 ? preload : null}
          imageClassName={cn(image.className, imageClassName)}
        />
      ))}
    </Slider>
  )
}
