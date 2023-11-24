import { useAtomValue } from 'jotai'
import { getNewYorkDate, parseReleaseDate } from '../../helpers/dates'
import { resolveInternalLinkUrl } from '../../helpers/resolvers'
import { useReleaseDate } from '../../hooks/useReleaseDate'
import { settingsAtom } from '../../store/content'
import ClientOnly from '../ClientOnly'
import DropDown from '../DropDown'
import { MonoTag } from '../Typography/Mono'
import AddToCalendarLinks from './AddToCalendarLinks'

export default function AddToCalendarAction ({
  className,
  release,
  showCaret = true,
  showDropText = true,
  buttonText = 'Add to Cal',
  classNames,
  withHover,
  ...props
}) {
  const { siteUrl } = useAtomValue(settingsAtom)
  const { releaseDate, releaseDateLabel, released, releasedText } = useReleaseDate(release)

  if (!release || released) return null

  const { title, relatedArticle } = release || {}
  const dropText = released ? releasedText : releaseDateLabel || getNewYorkDate(parseReleaseDate(releaseDate)).format('DD MMM YYYY')

  // Construct the `event` object
  const url = `${siteUrl}/${resolveInternalLinkUrl(relatedArticle || {})}`
  const description = `Release of the "${title}" on House of Heat.\nCheckout ${url} for more information.`
  const date = parseReleaseDate(releaseDate).utc()
  const startDatetime = date.format('YYYYMMDDTHHmmssZ')
  const endDatetime = date.add(1, 'day').format('YYYYMMDDTHHmmssZ')
  const event = {
    title,
    description,
    duration: 24,
    startDatetime,
    endDatetime
  }

  const label = showDropText && (
    <MonoTag className='hidden md:inline'>
      {!released && <span className='opacity-50'>Drops </span>}
      {dropText}
    </MonoTag>
  )

  return (
    <DropDown
      buttonText={buttonText}
      label={label}
      showCaret={showCaret}
      className={className}
      classNames={classNames}
      withHover={withHover}
      {...props}
    >
      <ClientOnly>
        <AddToCalendarLinks event={event} className={classNames.links}/>
      </ClientOnly>
    </DropDown>
  )
}
