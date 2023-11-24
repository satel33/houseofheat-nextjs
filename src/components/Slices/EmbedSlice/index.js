import cn from 'clsx'
import getYouTubeID from 'get-youtube-id'
import {
  FacebookEmbed,
  InstagramEmbed,
  TikTokEmbed,
  TwitterEmbed
} from 'react-social-media-embed'
import ClientOnly from '../../ClientOnly'
import Section from '../../Section'

const Embed = ({ url }) => {
  if (url.indexOf('<iframe') >= 0) {
    return <div dangerouslySetInnerHTML={{ __html: url }} />
  }

  if (url.indexOf('facebook') >= 0) {
    return (
      <FacebookEmbed url={url} width='100%' style={{ maxWidth: '550px' }} />
    )
  }

  if (url.indexOf('twitter') >= 0) {
    return <TwitterEmbed url={url} width='100%' style={{ maxWidth: '550px' }} />
  }

  if (url.indexOf('tiktok') >= 0) {
    return <TikTokEmbed url={url} width='100%' style={{ maxWidth: '550px' }} />
  }

  if (url.indexOf('youtube') >= 0) {
    const id = getYouTubeID(url)
    return (
      <div className='relative aspect-video w-full'>
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          frameBorder='0'
          allow='autoplay; encrypted-media'
          allowFullScreen
          title='video'
          className='absolute inset-0 w-full h-full'
          loading='lazy'
        />
      </div>
    )
  }

  if (url.indexOf('instagram') >= 0) {
    return (
      <InstagramEmbed url={url} width='100%' style={{ maxWidth: '550px' }} />
    )
  }

  return <div>The url is not supported: {url}</div>
}

const Loading = ({ url }) => (
  <div
    className={cn(
      'bg-gray-300 animate-pulse',
      url.indexOf('youtube') >= 0 ? 'aspect-square' : 'aspect-video '
    )}
  />
)

export default function EmbedSlice ({ data, className, noGutter }) {
  const { url } = data

  return (
    <Section
      grid
      noGutter={noGutter}
      className='mb-16 md:mb-20 last:mb-0 last:md:mb-0'
      noBottomMargin
    >
      <div
        className={className || 'col-span-full md:col-start-7 md:col-end-12'}
      >
        <ClientOnly placeholder={Loading} url={url}>
          <Embed url={url} />
        </ClientOnly>
      </div>
    </Section>
  )
}
