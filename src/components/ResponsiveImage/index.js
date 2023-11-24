import cn from 'clsx'
import get from 'lodash/get'
import { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react'

import gsap from 'gsap'
import Head from 'next/head'
import transform, { MOBILE_WIDTHS } from './transform'

export const getObjectPosition = (hotspot, crop) => {
  if (!hotspot) return '50% 50%'
  if (!crop) return `${hotspot.x * 100}% ${hotspot.y * 100}%`
  return `${((hotspot.x - crop.left) / (1 - (crop.left + crop.right))) *
    100}% ${((hotspot.y - crop.top) / (1 - (crop.top + crop.bottom))) * 100}%`
}

const Source = ({ media, srcSet, sizes }) => {
  const srcName = 'srcSet'
  // const srcName = lazy ? 'data-srcset' : 'srcSet'
  const srcset = key => srcSet.map(item => `${item[key]} ${item.width}w`).join()
  return (
    <source
      media={media}
      {...{ [srcName]: srcset('url') }}
      sizes={sizes}
      suppressHydrationWarning
    />
  )
}

const Picture = forwardRef(
  (
    {
      pictureClassName,
      style,
      className,
      alt,
      fallbackAlt,
      srcSet,
      mobileSrcSet,
      preload,
      imageSizes,
      onLoad
    },
    ref
  ) => {
    const srcsetData = srcSet.map(item => `${item.url} ${item.width}w`).join()
    const mobileSrcsetData = mobileSrcSet
      ?.map(item => `${item.url} ${item.width}w`)
      .join()

    return (
      <picture className={pictureClassName}>
        {mobileSrcSet && srcSet && (
          <>
            <Source
              srcSet={mobileSrcSet}
              sizes={imageSizes}
              media='(max-width: 1023px)'
              lazy={!preload}
            />
            <Source
              srcSet={srcSet}
              sizes={imageSizes}
              media='(min-width: 1024px)'
              lazy={!preload}
            />
          </>
        )}
        {!mobileSrcSet && srcSet && (
          <Source srcSet={srcSet} lazy={!preload} sizes={imageSizes} />
        )}
        <img
          ref={ref}
          data-sizes='auto'
          sizes={imageSizes}
          alt={alt || fallbackAlt}
          src={srcSet[0].url}
          loading={preload ? 'eager' : 'lazy'}
          onLoad={onLoad}
          className={className}
          style={style}
        />
        {preload && (
          <Head>
            {mobileSrcSet && (
              <>
                <link
                  rel='preload'
                  as='image'
                  href={mobileSrcSet[0].url}
                  imageSrcSet={mobileSrcsetData}
                  imageSizes={imageSizes}
                  media='(max-width: 1023px)'
                />
                <link
                  rel='preload'
                  as='image'
                  href={srcSet[0].url}
                  imageSrcSet={srcsetData}
                  imageSizes={imageSizes}
                  media='(min-width: 1024px)'
                />
              </>
            )}
            {!mobileSrcSet && (
              <link
                rel='preload'
                as='image'
                href={srcSet[0].url}
                imageSrcSet={srcsetData}
                imageSizes={imageSizes}
              />
            )}
          </Head>
        )}
      </picture>
    )
  }
)

Picture.displayName = 'Picture'

const ResponsiveImage = forwardRef(
  (
    {
      className,
      imageClassName,
      aspect,
      mobileAspect,
      contain,
      children,
      image,
      fallbackAlt,
      mobileImage,
      preload = false,
      showPreview = false,
      style,
      imageSizes,
      objectPosition
    },
    ref
  ) => {
    const pictureRef = useRef()
    const data = useMemo(() => transform(image, !contain && aspect), [
      image,
      contain,
      aspect
    ])
    const localRef = useRef({ animatingIn: false })
    const mobileData = useMemo(
      () =>
        mobileImage || mobileAspect
          ? transform(
            mobileImage || image,
            !contain && mobileAspect,
            MOBILE_WIDTHS
          )
          : null,
      [mobileImage, mobileAspect, image, contain]
    )
    const { hotspot, crop } = {
      hotspot: get(image, ['hotspot']),
      crop: get(image, ['crop'])
    }

    const imagePreviewBackgroundColor = get(image, [
      'asset',
      'metadata',
      'palette',
      'dominant',
      'background'
    ])

    const srcSet = get(data, ['sizes'])
    const mobileSrcSet = get(mobileData, ['sizes'])
    const alt = get(image, ['alt']) || get(image, ['asset', 'altText'])

    const resolvedMobileAspect =
      mobileAspect || get(mobileData, ['sourceAspect'])
    const resolvedAspect = aspect || data?.sourceAspect

    const containerStyle = useMemo(() => {
      return {
        ...(showPreview && !image?.transparentBackground && imagePreviewBackgroundColor
          ? { backgroundColor: imagePreviewBackgroundColor }
          : {}),
        ...(style || {})
      }
    }, [style, imagePreviewBackgroundColor, showPreview, image?.transparentBackground])

    const onLoad = useCallback(() => {
      if (!preload && !localRef.current.animatingIn) {
        localRef.current.animatingIn = true
        gsap.to(pictureRef.current, {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.inOut'
        })
      }
    }, [preload])

    useEffect(() => {
      if (pictureRef.current?.complete) {
        onLoad()
      }
    }, [])

    if (!srcSet) return null

    // Needed to add theses silly div's to set the aspect for mobile and desktop as there is no way
    // to have a dynamic prop in a media query and have that css ssr
    return (
      <div
        className={cn(className, 'relative w-full block overflow-hidden')}
        ref={ref}
        style={containerStyle}
      >
        {!resolvedMobileAspect && (
          <div style={{ paddingTop: `${100 / resolvedAspect}%` }} />
        )}
        {resolvedMobileAspect && (
          <>
            <div
              className='hidden md:block'
              style={{ paddingTop: `${100 / resolvedAspect}%` }}
            />
            <div
              className='block md:hidden'
              style={{ paddingTop: `${100 / resolvedMobileAspect}%` }}
            />
          </>
        )}
        <Picture
          className={cn(
            imageClassName,
            !preload && 'opacity-0',
            'absolute w-full h-full inset-0',
            contain ? 'object-contain' : 'object-cover'
          )}
          ref={pictureRef}
          onLoad={onLoad}
          alt={alt}
          fallbackAlt={fallbackAlt}
          srcSet={srcSet}
          mobileSrcSet={mobileSrcSet}
          preload={preload}
          imageSizes={imageSizes}
          style={{
            objectPosition: objectPosition || getObjectPosition(hotspot, crop)
          }}
        />
        {children}
      </div>
    )
  }
)

ResponsiveImage.displayName = 'ResponsiveImage'

export default ResponsiveImage
