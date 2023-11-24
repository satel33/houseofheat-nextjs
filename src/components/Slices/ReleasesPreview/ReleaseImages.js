import cn from 'clsx'
import Link from '../../Link'
import ResponsiveImage from '../../ResponsiveImage'

const ReleaseImage = ({ image, show, backgroundColor, release }) => {
  return (
    <Link
      link={release}
      className={cn(
        'position absolute inset-0 p-20 transition-all duration-300 ease-custom-out',
        show
          ? 'pointer-events-auto'
          : 'pointer-events-none'
      )}
      style={{
        backgroundColor,
        opacity: show ? 1 : 0
      }}
      showText={false}
    >
      <ResponsiveImage
        image={image}
        aspect={606 / 387}
        className='h-full transition-transform duration-300 ease-custom-out'
        contain
        fallbackAlt={release?.title}
        imageSizes='calc(60vw - 13rem)'
        style={{ transform: show ? 'scale(1)' : 'scale(.9)' }}
      />
    </Link>
  )
}

export default function ReleaseImages ({ releases, selectedIndex }) {
  return (
    <div className='hidden relative md:flex md:col-span-7 transition-colors items-center p-20 pt-[62%] overflow-hidden'>
      {releases?.map((release, i) => (
        <ReleaseImage
          key={release._id}
          image={release.featuredImage}
          show={selectedIndex === i}
          backgroundColor={release.pageTheme || release.relatedArticle?.pageTheme}
          release={release}
          fallbackAlt={release?.title}
        />
      ))}
    </div>
  )
}
