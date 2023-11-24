import cn from 'clsx'
import { useMemo } from 'react'
import { getForegroundColorFromBackgroundColor } from '../../helpers/colors.js'
import { getMetaDescription } from '../../helpers/page.js'
import screens from '../../theme/screens.cjs'
import Advertisement from '../Advertisement'
import BuyNowButton from '../ArticleTile/BuyNowButton'
import Rating from '../ArticleTile/Rating'
import Button from '../Button.js'
import Link from '../Link'
import ResponsiveImage from '../ResponsiveImage'
import Section from '../Section'
import Heading from '../Typography/Heading'
import Mono from '../Typography/Mono'

const GenericTile = ({ className, title, excerpt, link, image, size, pageTheme, children }) => {
  const aspect = size === 'large' ? 920 / 476 : 448 / 446
  return (
     <article className={className}>
      <Link link={link} showText={false} className='mb-4 block group'>
        {image && <ResponsiveImage
          image={image}
          aspect={aspect}
          mobileAspect={448 / 446}
          className='w-full mb-6 overflow-hidden'
          imageClassName='group-hover:scale-105 transition-all duration-300'
          contain={!image?.cover}
          style={{ backgroundColor: pageTheme }}
          objectPosition={!image?.cover && '50% 80%'}
          imageSizes={
            size === 'large'
              ? `(max-width: ${screens.md}) 100vw, 75vw`
              : `(max-width: ${screens.md}) 100vw, 37.5vw`
          }
        />}
        <Heading as='h2' tagStyle='h4' className='line-clamp-2 mb-4'>
          {title}
        </Heading>
        <p className='line-clamp-2 h-[3em]'>{excerpt}</p>
      </Link>
      {children}
    </article>
  )
}

const ReleaseTile = ({ className, data }) => {
  const { release, size } = data
  const { title, featuredImages, pageTheme, pageType } = release
  const image = featuredImages?.[0]
  const excerpt = getMetaDescription(release, null, 250)
  return (
    <GenericTile className={className} link={release} size={size} title={title} excerpt={excerpt} pageTheme={pageTheme} image={image}>
      {pageType === 'release' && (
        <div className='grid grid-cols-2 gap-2'>
          <BuyNowButton
            article={release}
            withBorder
            className='justify-self-start'
          />
          <Mono className='flex items-center justify-self-end'>
            <Rating article={release} />
          </Mono>
        </div>
      )}
    </GenericTile>
  )
}

const CustomTile = ({ className, data }) => {
  const { size, customTile } = data
  const { title, description, link, image, links } = customTile
  return (
    <GenericTile className={className} link={link} size={size} title={title} excerpt={description} image={image}>
      <div className='flex flex-col gap-2 items-start'>
        {links?.map((l, i) => <Button className='inline-block justify-self-start font-mono uppercase leading-[1.2] text-sm' as={Link} key={i} link={l} withBorder />)}
      </div>
    </GenericTile>
  )
}

const TILE_SELECTOR = {
  article: ReleaseTile,
  custom: CustomTile
}

export default function ReleasesGrid ({ data }) {
  const { releases, backgroundColor } = data
  const { background, foreground } = useMemo(() => {
    if (!backgroundColor) return {}
    return {
      background: backgroundColor,
      foreground: getForegroundColorFromBackgroundColor(backgroundColor)
    }
  }, [])

  return (
    <Section grid style={{ '--background': background, '--foreground': foreground, backgroundColor: 'var(--background)', color: 'var(--foreground)' }} className={cn(backgroundColor && 'py-8 md:py-16')}>
      <div className='col-span-full md:col-start-4 grid xs:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12'>
        {releases?.map((data, i) => {
          if (data._type === 'advertisement') return <Advertisement key={i} data={data} className='col-span-full w-auto ml-0 md:ml-[calc(((100vw-8px-3rem-(1.5rem*11))/12*-3)-(3*1.5rem))]' bottomMargin={false} />
          const Tile = TILE_SELECTOR[data.tileType]
          const { size } = data
          return <Tile key={i} data={data} className={cn(size === 'large' && 'xs:col-span-full')} />
        })}
      </div>
    </Section>
  )
}
