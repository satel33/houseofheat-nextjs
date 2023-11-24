import get from 'lodash/get'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import { useAtomValue } from 'jotai'
import { getMetaDescription } from '../helpers/page'
import { settingsAtom } from '../store/content'
import { builder as imageBuilder } from './ResponsiveImage/transform'

export default function Meta ({ seo, page }) {
  const settings = useAtomValue(settingsAtom)
  const metaImage = seo?.meta_image?.asset || page?.featuredImages?.[0]?.asset
  const imageUrl =
    metaImage &&
    imageBuilder
      .image(metaImage)
      .width(1200)
      .height(630)
      .url()
  const { asPath: pathname } = useRouter()
  const baseUrl = settings.siteUrl

  const metadata = useMemo(() => {
    const defaultCanonicalUrl = baseUrl ? `${baseUrl}${pathname}` : undefined
    const pageTitle = get(page, ['title'])
    const siteTitle = get(settings, ['siteTitle'])
    let title = pageTitle || siteTitle
    if (title !== siteTitle) {
      title = `${title} | ${siteTitle}`
    }
    return {
      ...(seo || {}),
      ...{
        meta_title: pageTitle,
        site_name: siteTitle,
        og_url: defaultCanonicalUrl,
        canonical_url: defaultCanonicalUrl,
        title,
        meta_description: getMetaDescription(page, seo)
      }
    }
  }, [baseUrl, seo, settings, page, pathname])

  const metaDesc = metadata.meta_description
  const metaTitle = metadata.meta_title
  const siteName = metadata.site_name

  return (
    <Head>
      <title>{metadata.title}</title>
      <meta name='robots' content='index, follow, max-image-preview:large' />
      {metadata.meta_keywords && (
        <meta name='keywords' content={metadata.meta_keywords} />
      )}
      {metadata.og_url && <meta property='og:url' content={metadata.og_url} />}
      {metaTitle && (
        <>
          <meta property='title' content={metaTitle} />
          <meta property='og:title' content={metaTitle} />
          <meta name='twitter:title' content={metaTitle} />
        </>
      )}
      {metaDesc && (
        <>
          <meta name='description' content={metaDesc} />
          <meta property='og:description' content={metaDesc} />
          <meta name='twitter:description' content={metaDesc} />
        </>
      )}
      {metaImage && (
        <>
          <meta property='og:image' content={imageUrl} />
          <meta property='og:image:width' content={1200} />,
          <meta property='og:image:height' content={630} />
          <meta name='twitter:image' content={imageUrl} />
        </>
      )}
      {siteName && (
        <>
          <meta property='og:site_name' content={metadata.site_name} />
          <meta name='twitter:site' content={metadata.site_name} />
        </>
      )}

      {metadata.canonical_url && (
        <link rel='canonical' href={metadata.canonical_url} />
      )}
    </Head>
  )
}
