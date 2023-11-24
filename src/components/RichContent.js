import BlockContent from '@sanity/block-content-to-react'
import cn from 'clsx'
import React, { forwardRef } from 'react'

import dynamic from 'next/dynamic'
import screens from '../theme/screens.cjs'
import Advertisement from './Advertisement/index.js'
import ImageCaption from './ImageCaption.js'
import Link from './Link'
import ResponsiveImage from './ResponsiveImage'
import EmbedPlaceholder from './Slices/EmbedSlice/Placeholder'
import Heading from './Typography/Heading'
import Mono, { MonoSmall, MonoTag } from './Typography/Mono'

const EmbedSlice = dynamic(() => import('./Slices/EmbedSlice'), {
  loading: EmbedPlaceholder
})

const SectionTitle = ({ as = 'h3', title, update = false }) => {
  const Component = as
  return (
    <>
      <div className='absolute left-4 right-4 md:left-6 md:right-6 h-[1px] bg-black opacity-20 -mt-4 md:mt-0' />
      <Component
        className={cn(
          'flex items-center font-mono uppercase tracking-wide text-sm md:absolute md:left-6 mt-12 mb-6 md:mt-6 not-prose',
          update && 'section-title-update'
        )}
      >
        <span
          className={cn(
            'rounded-full bg-current w-2 h-2 mr-2',
            update && 'text-update'
          )}
        />
        {title}
      </Component>
      <div className='h-[1.3rem] md:mt-20 hidden md:block' />
    </>
  )
}

const BlockRenderer = props => {
  const { style = 'normal' } = props.node

  if (style === 'mono') {
    return (
      <Mono className='not-prose'>
        {BlockContent.defaultSerializers.types.block(props)}
      </Mono>
    )
  }

  if (style === 'mono-small') {
    return (
      <MonoSmall className='not-prose '>
        {BlockContent.defaultSerializers.types.block(props)}
      </MonoSmall>
    )
  }

  if (style === 'mono-tag') {
    return (
      <MonoTag className='not-prose'>
        {BlockContent.defaultSerializers.types.block(props)}
      </MonoTag>
    )
  }

  if (style === 'bigtext') {
    return (
      <Heading as='h4' className='mt-16 md:mt-10 font-normal'>
        {props.children}
      </Heading>
    )
  }

  if (style === 'smalltext') {
    return (
      <span className='text-[0.875rem] leading-5 block'>{props.children}</span>
    )
  }

  if (style === 'blockquote') {
    return (
      <Heading as='h5' tagStyle='h3' className='my-10 font-normal'>
        {props.children}
      </Heading>
    )
  }

  return BlockContent.defaultSerializers.types.block(props)
}

export const serializers = {
  types: {
    block: BlockRenderer,
    image: ({ node }) => {
      return (
        <div>
          <ResponsiveImage
            image={node}
            imageSizes={`(max-width: ${screens.md}) 100vw, calc(66vw - 3rem)`}
          />
          <ImageCaption image={node} />
        </div>
      )
    },
    sectionTitle: ({ node }) => {
      return <SectionTitle title={node.title} />
    },
    embed: ({ node }) => {
      return (
        <EmbedSlice as='div' data={node} className='col-span-full' noGutter />
      )
    },
    ctaButton: ({ node }) => {
      return (
        <Link link={node} className='inline-block min-w-[18rem] text-center text-sm no-underline bg-transparent uppercase p-6 mt-4 md:mt-8 hover:text-white hover:bg-black border border-current hover:border-black border-solid transition-colors ease-in-out'/>
      )
    },
    advertisement: ({ node }) => {
      return (
        <Advertisement data={node} size='tile' />
      )
    }
  },
  marks: {
    link: ({ mark, children }) => {
      return (
        <Link link={{ ...mark }} showText={false}>
          {children}
        </Link>
      )
    },
    sectionLabel: ({ children }) => {
      return <SectionTitle as='span' title={children} />
    },
    updateSectionLabel: ({ children }) => {
      return <SectionTitle as='span' title={children} update />
    }
  }
}

const RichContent = forwardRef(
  ({ className, content, children, style }, ref) => {
    return (
      <div className={cn(className, 'prose')} ref={ref} style={style}>
        <BlockContent
          renderContainerOnSingleChild
          blocks={content}
          serializers={serializers}
        />
        {children}
      </div>
    )
  }
)

RichContent.displayName = 'RichContent'

export default RichContent
