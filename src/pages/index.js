import Page, { getStaticProps as getStaticPropsPage } from './[...slug]'

export default Page

export async function getStaticProps (options) {
  return getStaticPropsPage(options)
}
