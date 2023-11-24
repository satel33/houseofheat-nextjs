import cn from 'clsx'
import isEmpty from 'lodash/isEmpty'
import ArticleTile from './ArticleTile/ArticleTile'
import Section from './Section'
import Heading from './Typography/Heading'

const RelatedArticles = ({ articles, title }) => {
  if (isEmpty(articles)) return null
  return (
    <Section grid>
      <Heading as='h3' className='col-span-full font-bold text-[4.25rem] md:text-[9rem] lg:text-[12rem]'>
        {title}
      </Heading>
      {articles.map((article, i) => (
        <ArticleTile
          key={article._id}
          article={article}
          className={cn(
            'col-span-full md:col-span-4 xl:col-span-3',
            i === 2 && 'hidden md:block',
            i === 3 && 'hidden xl:block'
          )}
        />
      ))}
    </Section>
  )
}

export default RelatedArticles
