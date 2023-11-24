import last from 'lodash/last'

import PageComponent from '../components/PageComponent'
import { resolveInternalLinkUrl } from '../helpers/resolvers'
import getPageData from '../server/getPageData.server'
import getReleasesByBrandPageData from '../server/getReleasesByBrandPageData.server'

const HOME_SLUG = 'home'

const releasesByBrandSlugRegex = /(.*)-release-dates/

export default function Page (props) {
  return <PageComponent {...props} />
}

export async function getStaticProps ({
  preview = false,
  previewData,
  params
}) {
  const { slug = [HOME_SLUG] } = params || {}
  if (last(slug) === '__webpack_hmr') return { notFound: true }

  let pageData = null
  const matchReleasesByBrand = last(slug).match(releasesByBrandSlugRegex)
  if (matchReleasesByBrand) {
    const [, brand] = matchReleasesByBrand
    pageData = await getReleasesByBrandPageData(last(slug), brand, {
      active: preview,
      token: previewData?.token
    })
  }

  if (!pageData) {
    pageData = await getPageData(last(slug), {
      active: preview,
      token: previewData?.token
    })
  }

  const page = pageData.page

  if (!page) {
    return {
      notFound: true,
      revalidate: false
    }
  }

  const resolvedUrl = resolveInternalLinkUrl(page)
  const currentUrl = last(slug) === HOME_SLUG ? '/' : `/${slug.join('/')}`

  if (resolvedUrl !== currentUrl) {
    return {
      redirect: {
        destination: resolvedUrl,
        permanent: true
      },
      revalidate: false
    }
  }

  const revalidate = pageData.pageType === 'page'
    ? 60 * 10 // 10 minute
    : 60 * 60 * 24 // 1 day revalidation

  return {
    props: {
      data: pageData,
      preview
    },
    revalidate
  }
}

export async function getStaticPaths () {
  return { paths: [], fallback: 'blocking' }
}
