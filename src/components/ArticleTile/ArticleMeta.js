import cn from 'clsx'
import { formatDate } from '../../helpers/dates'
import { useReleaseDate } from '../../hooks/useReleaseDate'
import Mono from '../Typography/Mono'
import { Tags } from './ArticleMetaTags'
import BuyNowButton from './BuyNowButton'
import Rating from './Rating'
import ReleaseCountdown from './ReleaseCountdown'

const ReleaseArticleMeta = ({
  article,
  className,
  showRatingProgressBar,
  buttonTransition,
  showBuyNow = true,
  variant = 'tile',
  isHovering,
  isSearch = false
}) => {
  const { _id } = article
  const { releaseDate, releaseDateLabel } = useReleaseDate(article)
  const ratingDisabled = article.rating?.disabled

  return (
    <Mono
      as='div'
      className={cn(
        className,
        !isSearch && 'grid gap-1 grid-cols-3',
        'row-start-1 w-full relative text-xs h-9',
        variant === 'featured-homepage' &&
          'md:gap-6 md:grid-cols-8 xl:grid-cols-9',
        variant === 'featured' && 'md:gap-6 md:grid-cols-12',
        isSearch && 'flex justify-between'
      )}
    >
      {!isSearch && variant === 'tile' && <div className='line w-100 absolute top-0 left-0 right-0 h-[1px] bg-current opacity-50'/>}
      {!isSearch && variant === 'tile' && <div className='line w-100 absolute bottom-0 left-0 right-0 h-[1px] bg-current opacity-50'/>}
      <ReleaseCountdown
        date={releaseDate}
        releaseDateLabel={releaseDateLabel}
        key={article._id}
        className={cn(
          'flex items-center row-start-1 ',
          (variant === 'featured-homepage' || variant === 'featured') &&
            'col-start-3 md:col-start-5 md:col-span-3 justify-end md:justify-start',
          variant === 'featured' && 'hidden md:flex'
        )}
      />
      {_id && !ratingDisabled && (
        <span
          className={cn(
            'flex items-center row-start-1 ',
            variant === 'tile' && 'justify-center',
            (variant === 'featured-homepage' || variant === 'featured') &&
              'justify-start col-start-1 md:col-start-1 md:col-span-2'
          )}
        >
          <Rating article={article} showProgressBar={showRatingProgressBar} isHovering={isHovering}/>
        </span>
      )}
      {showBuyNow && (
        <span
          className={cn(
            'flex justify-end row-start-1 self-center',
            !_id && 'col-span-2',
            variant === 'featured-homepage' &&
              'hidden md:flex md:col-start-7 xl:col-start-8 md:col-span-2',
            variant === 'featured' &&
              'col-start-3 md:col-start-11 md:col-span-2'
          )}
        >
          <BuyNowButton article={article} withTransition={buttonTransition} flash={true} className='group h-5 border-[1px] hover:border-black py-1 px-2' textClassName='text-xs'/>
        </span>
      )}
    </Mono>
  )
}

const PageArticleMeta = ({ article, className, isBackgroundDark, isSearch = false }) => {
  return (
    <Mono as='div' className={cn(className, 'flex justify-between items-center relative py-2 text-xs h-9')}>
      {!isSearch && <div className='line w-100 absolute top-0 left-0 right-0 h-[1px] bg-current opacity-50'/>}
      {article.publishedDate && <span>Posted {formatDate(article.publishedDate)}</span>}
      <Tags brand={article.brand} model={article.model} tags={article.tags} className={isSearch ? 'text-xxx' : 'text-xs'} margin={false} isDark={isBackgroundDark} limit={isSearch ? 1 : 2}/>
      {!isSearch && <div className='line w-100 absolute bottom-0 left-0 right-0 h-[1px] bg-current opacity-50'/>}
    </Mono>
  )
}

export default function ArticleMeta ({ article, ...rest }) {
  const { pageType } = article

  if (pageType === 'release') {
    return <ReleaseArticleMeta article={article} {...rest} />
  }

  return <PageArticleMeta article={article} {...rest} />
}
