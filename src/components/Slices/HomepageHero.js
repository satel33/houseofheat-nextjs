import colors from '../../theme/colors.cjs'
import screens from '../../theme/screens.cjs'
import ArticleTile from '../ArticleTile/ArticleTile'
import CustomFeatureTile from '../ArticleTile/CustomerFeatureTile'
import FeaturedArticleTile from '../ArticleTile/FeaturedArticleTile.js'
import { useRegisterHeaderColorSwitcher } from '../Menu/headerHooks'
import Section from '../Section'

export default function HomepageHero ({ data }) {
  const { featureArticle, featureTileType, asideTopArticle, asideBottomArticle, customFeatureTile } = data

  const { pageTheme } = featureArticle
  const backgroundColor = pageTheme || colors.defaultPageTheme
  const ref = useRegisterHeaderColorSwitcher(backgroundColor)

  // The margin calculation looks a bit strange, what we are doing is positioning the hero below the
  // large logo, to do this we need to get the height of the element. To get the height we take the
  // viewport width and take the padding and menu button and the using the aspect ratio of the image we
  // can get the height ((100vw-4rem-47px)/7.94). We then move it down by 3.4vw because the logo is transformed
  // by this much and then we add the 5.8rem which is the height of the toolbar plus the padding below the logo
  return (
    <Section
      grid
      className='pt-12 md:pt-0 md:mt-[calc(((100vw-4rem-47px)/7.94)+5.8rem+3.4vw)]'
    >
      {featureTileType === 'custom' && (
        <CustomFeatureTile
          {...customFeatureTile}
          className='col-span-full md:col-span-8 xl:col-span-9 row-span-2 pt-0'
          ref={ref}
          variant='homepage'
          preload
          imageSizes={`(max-width: ${screens.md}) 100vw, 60vw`}
        />
      )}
      {featureTileType !== 'custom' && (
        <FeaturedArticleTile
          article={featureArticle}
          className='col-span-full md:col-span-8 xl:col-span-9 row-span-2 pt-[25vw] md:pt-0'
          ref={ref}
          variant='homepage'
          preload
          imageSizes={`(max-width: ${screens.md}) 100vw, 60vw`}
        />
      )}
      <ArticleTile
        article={asideTopArticle}
        className='hidden col-span-full md:col-span-4 xl:col-span-3 md:col-start-9 xl:col-start-10 md:flex flex-col'
        imageAspect={1.9}
        centerAlignTitle
        preload
        imageSizes={`(max-width: ${screens.md}) 1px, 30vw`}
        imageClassName='p-6'
      />
      <ArticleTile
        article={asideBottomArticle}
        className='hidden col-span-full md:col-span-4 xl:col-span-3 md:col-start-9 xl:col-start-10 md:row-start-2 md:flex flex-col'
        imageAspect={1.9}
        centerAlignTitle
        preload
        imageSizes={`(max-width: ${screens.md}) 1px, 30vw`}
        imageClassName='p-6'
      />
    </Section>
  )
}
