import last from 'lodash/last'
// import getImageAssetByFileName from '../../server/getImageAssetByFileName'
import { data } from '../../server/image-data'

export default function ImageRedirect () {
  return null
}

const addOriginalFilenameToUrl = (url, originalFilename) => {
  if (!originalFilename) return url
  const u = new URL(url)
  u.pathname = `${u.pathname}/${originalFilename}`
  return u.toString()
}

export async function getStaticProps ({ params }) {
  const { slug } = params || {}
  const imageFileName = last(slug)

  const imageUrl = data[imageFileName]

  if (!imageUrl) {
    return {
      notFound: true,
      revalidate: false
    }
  }

  return {
    redirect: {
      destination: addOriginalFilenameToUrl(imageUrl, imageFileName),
      permanent: true
    },
    revalidate: false
  }
}

export async function getStaticPaths () {
  return { paths: [], fallback: 'blocking' }
}
