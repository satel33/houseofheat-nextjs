import TagPageHero from './TagPageHero'
import CulturePageHero from './CulturePageHero'
import PagePageHero from './PagePageHero'
import ReleasePageHero from './ReleasePageHero'
import ReleasePageHeroActions from './ReleasePageHeroActions'

export default function PageHero ({ data, page }) {
  switch (page.pageType) {
    case 'tag':
      return <TagPageHero data={data} page={page} />

    case 'page':
      return <PagePageHero data={data} page={page} />

    case 'release':
      return (
        <>
          <ReleasePageHero data={data} page={page} />
          <ReleasePageHeroActions data={data} page={page} />
        </>
      )

    case 'culture':
      return <CulturePageHero data={data} page={page} />

    default:
      return null
  }
}
