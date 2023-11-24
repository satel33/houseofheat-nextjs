import cn from 'clsx'
import { useAtomValue } from 'jotai'
import { stringify } from '../../helpers/string'
import CaretIcon from '../../icons/caret.svg'
import { settingsAtom } from '../../store/content'
import Button from '../Button'
import Link from '../Link'
import ResponsiveImage from '../ResponsiveImage'
import RichContent from '../RichContent'
import SocialIcon from '../SocialIcon'
import Ticker from '../Ticker'
import Mono from '../Typography/Mono'

export default function Newsletter ({ data, className }) {
  const { title, text, cta } = data
  const { newsletterSettings } = useAtomValue(settingsAtom)

  // Construct the mailto email address
  const { email, socialLinks, backgroundImage, ...params } = newsletterSettings
  const href = `mailto:${email}?${stringify(params)}`

  return (
    <div
      className={cn(
        'newsletter-slice overflow-hidden pt-52 pb-36 md:pt-44 md:pb-24 relative',
        className
      )}
    >
      {backgroundImage?.assset && <ResponsiveImage
        image={backgroundImage}
        className='!absolute inset-0 z-0'
        fallbackAlt='gradient'
      />}
      <Ticker className='mb-8 md:mb-0 select-none'>
        <span className='font-sans pr-6 md:pr-20 text-[6rem] md:text-[10rem] font-bold block leading-[0.8]'>
          {title.split(' ').map((word, i, arr) => (
            <span
              key={i}
              className={i !== arr.length - 1 ? 'pr-6 md:pr-20' : ''}
            >
              {word}
            </span>
          ))}
        </span>
      </Ticker>
      <div className='-mt-14 md:-mt-16'>
        <div className='relative px-6 md:px-0 max-w-xl md:max-w-newsletter-btn mb-8 mx-auto text-center md:mt-4 md:mb-16'>
          <Button
            as='a'
            href={href}
            target='_blank'
            className='bg-white px-4 xs:px-6 lg:px-32 py-6 md:py-7 mb-8 md:mb-4 mx-auto gap-6 justify-center whitespace-nowrap text-[0.875rem] md:text-[1rem]'
            withBorder
          >
            <span>{cta.title}</span>
            <span className='inline-flex items-center opacity-50'>
              {cta.text} <CaretIcon className='h-3 ml-4 md:ml-6 inline-block' />
            </span>
          </Button>
          <RichContent content={text} className='mx-8 md:mx-4' />
        </div>
        {socialLinks.length > 0 && (
          <div className='text-center relative'>
            <Mono className='inline-block mb-4'>Follow</Mono>
            <ul className='flex items-center justify-center gap-x-8 md:gap-x-12'>
              {socialLinks.map(social => (
                <li key={social._key}>
                  <Link className='group' to={social.url} openInNewTab title={social.type}>
                    <SocialIcon
                      type={social.type}
                      className='transition-opacity duration-150 group-hover:opacity-50 h-4'
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
