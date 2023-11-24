import getErrorPageData from '../server/getErrorPageData.server'
import Page from './[...slug]'

export default Page

export const getStaticProps = async () => {
  const pageData = await getErrorPageData('error-page-404')

  return {
    props: {
      data: pageData
    },
    revalidate: 60 * 60 * 24
  }
}
