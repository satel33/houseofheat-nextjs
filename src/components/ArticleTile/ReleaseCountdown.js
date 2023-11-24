import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import reverse from 'lodash/reverse'
import { useEffect, useMemo, useRef } from 'react'

import { useAtomValue } from 'jotai'
import { inBrowser } from '../../helpers/browser'
import { formatNewYorkDate, isReleased, parseReleaseDate } from '../../helpers/dates'
import { settingsAtom } from '../../store/content'

dayjs.extend(LocalizedFormat)

export default function ReleaseCountdown ({
  date,
  releaseDateLabel,
  className,
  releaseDatePrefixText,
  releaseTimePrefixText,
  showCountdownOnly = false,
  fallbackComponent,
  dateFormat = 'YYYY.MM.DD'
}) {
  const ref = useRef()
  const { labels } = useAtomValue(settingsAtom)
  const { sneakerReleased: releasedText } = labels

  const { released, countdown, formattedDate } = useMemo(() => {
    if (!date) {
      return {}
    }

    const dateValue = parseReleaseDate(date)
    const hoursDiff = dateValue.diff(dayjs(), 'hour')

    return {
      released: isReleased(date),
      countdown: hoursDiff <= 24,
      formattedDate: `${releaseDatePrefixText || ''}${formatNewYorkDate(date, dateFormat)}`
    }
  }, [date])

  useEffect(() => {
    if (countdown && !releaseDateLabel && !released) {
      let animationId
      const updateTime = () => {
        if (ref.current) {
          const time = `${releaseTimePrefixText || ''}H-${formatCountdown(
            date
          )}`
          ref.current.innerHTML = time
          animationId = window.requestAnimationFrame(updateTime)
        }
      }
      updateTime()
      return () => {
        window.cancelAnimationFrame(animationId)
      }
    }
  }, [released, releaseDateLabel, date, countdown, releaseTimePrefixText])

  if (showCountdownOnly && (!countdown || released)) return fallbackComponent

  const text = released ? releasedText : formattedDate
  const defaultText = inBrowser() ? text || '--.--.--' : '--.--.--'
  const resolvedText = released ? releasedText : defaultText

  return (
    <span className={className} suppressHydrationWarning ref={ref}>
      {releaseDateLabel || resolvedText}
    </span>
  )
}

function formatCountdown (date) {
  if (!date) {
    return
  }

  const now = dayjs()
  const end = parseReleaseDate(date)

  if (isReleased(date)) {
    return '00.00.00'
  }

  let t = end.diff(now)
  const countdown = reverse(
    [
      [1, 1000],
      [1000, 60],
      [60, 60],
      [60, 24]
    ].map(([divisor, modulus]) => {
      t /= divisor
      return Math.floor(modulus ? t % modulus : t)
    })
  )

  return countdown
    .map(n => (n < 10 ? `0${n}` : `${n}`).substring(0, 2))
    .join(':')
}
