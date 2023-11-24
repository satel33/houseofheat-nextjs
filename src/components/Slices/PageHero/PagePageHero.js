import cn from 'clsx'
// import { useRouter } from 'next/router'

import { getPageThemeColor } from '../../../helpers/page'
import RichContent from '../../RichContent'
import Section from '../../Section'
import Heading from '../../Typography/Heading'

// Note: This component name is a bit weird, but it's to represent the "Page Hero" of a page whose `pageType` is a `page`.
export default function PagePageHero ({ page }) {
  // const router = useRouter()
  const backgroundColor = getPageThemeColor(page)
  const { title, copy, pageContentTitle } = page

  // If this is the "Releases" page, we need to hide the title on mobile...
  // const isReleasesPage = router.asPath === '/releases'

  return (
    <Section
      className={cn('pt-64 md:block md:mb-28')}
      style={{ backgroundColor }}
    >
      <Heading as='h0'>{pageContentTitle || title}</Heading>
      {copy && <RichContent content={copy} />}
    </Section>
  )
}
