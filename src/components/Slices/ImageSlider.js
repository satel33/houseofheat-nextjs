import cn from 'clsx'
import Section from '../Section'

import ImageCaption from '../ImageCaption'
import Link from '../Link'
import ResponsiveImage from '../ResponsiveImage'
import Slider from '../Slider'

const Slide = ({
  className,
  link,
  linkClassName,
  imageClassName,
  image,
  aspect,
  mobileAspect,
  style,
  onClick,
  ...rest
}) => {
  if (!image) return null
  return (
    <Link
      link={link}
      className={cn(linkClassName, 'block relative w-full')}
      showText={false}
      onClick={onClick}
    >
      <ResponsiveImage
        className={cn(className, 'cursor-grab active:cursor-grabbing')}
        image={image}
        aspect={aspect}
        mobileAspect={mobileAspect}
        style={style}
        contain={!image?.cover}
        imageClassName={imageClassName}
        {...rest}
      />
      <ImageCaption image={image} className='mb-2 ml-4 md:ml-6' />
    </Link>
  )
}

export default function ImageSlider ({ data, page }) {
  const backgroundColor = page.pageTheme
  return (
    <Section noGutter>
      <Slider style={{ backgroundColor }}>
        {data?.slides?.map((slide, i) => (
          <Slide
            key={i}
            image={slide.image}
            aspect={1440 / 600}
            mobileAspect={1440 / 800}
            link={slide.link}
            showPreview={false}
          />
        ))}
      </Slider>
    </Section>
  )
}
