import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(localizedFormat)
dayjs.extend(timezone)

const tz = 'America/New_York'

export function parseReleaseDate (date) {
  if (!date || date.length > 10) {
    return dayjs(date)
  } else {
    // If the release date does not have a time component then we are using a migrated date
    // We need to convert this to 00:00 in new york time
    const ds = dayjs(date)
    return dayjs()
      .tz(tz)
      .set('year', ds.year())
      .set('month', ds.month())
      .set('date', ds.date())
      .set('hour', 0)
      .set('minute', 0)
      .set('second', 0)
      .set('millisecond', 0)
      .local()
  }
}

export function getNewYorkDate (date) {
  return parseReleaseDate(date).tz(tz)
}

export function isReleased (date) {
  return date && dayjs().isAfter(parseReleaseDate(date))
}

export function formatNewYorkDate (date, format = 'YYYY.MM.DD') {
  return parseReleaseDate(date).tz(tz).format(format)
}

export function formatDate (date) {
  return dayjs(date).format('YYYY.MM.DD')
}

export function formatMonthAndYear (date) {
  return dayjs(date).tz(tz).format('MMM DD')
}
