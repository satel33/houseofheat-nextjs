import cn from 'clsx'
import React, { useCallback, useMemo } from 'react'
import { SHARE_SITES } from 'react-add-to-calendar-hoc'
import { buildShareUrl, isInternetExplorer } from 'react-add-to-calendar-hoc/lib/utils'
import { isChrome, isiOS } from './device'

const DEFAULT_ITEMS = Object.keys(SHARE_SITES).map(itm => SHARE_SITES[itm])

export default function AddToCalendarLinks ({
  items = DEFAULT_ITEMS,
  className,
  event,
  ...props
}) {
  const handleCalendarButtonClick = useCallback((e, url) => {
    const { filename = 'download' } = props
    e.preventDefault()
    if (url.startsWith('BEGIN')) {
      const blob = new window.Blob([url], {
        type: 'text/calendar;charset=utf-8'
      })

      if (isInternetExplorer()) {
        window.navigator.msSaveOrOpenBlob(blob, `${filename}.ics`)
      } else {
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.setAttribute('download', `${filename}.ics`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } else {
      window.open(url, '_blank')
    }
  }, [])

  const itemsToShow = useMemo(() => {
    if (isiOS() && isChrome()) return items.filter(v => v !== 'iCal')
    return items
  }, [items])

  return itemsToShow.map(item => (
    <button
      {...props}
      className={cn(
        'block text-black bg-white hover:bg-black hover:text-white px-3 py-2 font-mono text-sm uppercase w-full text-left',
        className
      )}
      key={item}
      onClick={(e) => handleCalendarButtonClick(e, buildShareUrl(event, item))}
    >
      {item}
    </button>
  ))
}
