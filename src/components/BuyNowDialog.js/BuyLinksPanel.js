import cn from 'clsx'
import dayjs from 'dayjs'
import { useAtomValue } from 'jotai'
import groupBy from 'lodash/groupBy'
import map from 'lodash/map'
import sortBy from 'lodash/sortBy'
import React, { useMemo } from 'react'
import { evaluateStringTemplate } from 'string-template-parser'
import { isReleased } from '../../helpers/dates'
import { settingsAtom } from '../../store/content'
import { MonoTag } from '../Typography/Mono'
import { selectedReleaseAtom } from './buyNowState'
import ExternalLinkIcon from './external-link.svg'
import Label from './Label'
import LinkItem from './LinkItem'
import RichContent from '../RichContent'

const EMPTY_STYLE_CODES = ['N/A']
const sanatiseStyleCode = (styleCode) => {
  if (EMPTY_STYLE_CODES.includes(styleCode)) return null
  return styleCode
}

const BuyLinks = () => {
  const selectedRelease = useAtomValue(selectedReleaseAtom)
  const settings = useAtomValue(settingsAtom)
  const { releaseLinks, defaultStoreLinks } = settings

  const buyLinks = useMemo(() => {
    if (!selectedRelease) return null
    const released = isReleased(selectedRelease.releaseDate)
    const now = dayjs()

    let links = selectedRelease?.shoppingButtons || []
    const styleCode = sanatiseStyleCode(selectedRelease.styleCode)
    const query = styleCode ? `${selectedRelease.model ? selectedRelease.model.title + ' ' : ''}${styleCode}` : selectedRelease.title
    const afterMarketLinks = releaseLinks
      ?.map(({ url, store, linkType, ...rest }) => {
        const overrideLink = links.find((l) => l.store._id === store._id)
        if (overrideLink) {
          return {
            linkType: overrideLink.linkType || linkType,
            ...overrideLink
          }
        }
        return ({
          ...rest,
          linkType,
          store,
          url: evaluateStringTemplate(url, {
            query,
            title: selectedRelease.title,
            model: selectedRelease.model?.title,
            styleCode
          }, {
            encode: value => encodeURI(value)
          })
        })
      })
    links = [
      ...(afterMarketLinks || []),
      ...links.filter(({ store }) => !releaseLinks.find((l) => l.store?._id === store?._id))
    ]

    links = links.map(link => ({
      ...link,
      url: link.url || defaultStoreLinks?.find(({ store }) => store._id === link.store?._id)?.url
    }))

    const buttons = links?.map(b => {
      const { avilableFrom: availableFrom, avilableTo: availableTo } = b

      let colorClassName = ''
      let status = ''
      const linkType = b.linkType || (b.text?.toLowerCase().indexOf('raffle') >= 0
        ? 'Raffles'
        : 'Releases')

      let text = b.text
      if (linkType === 'Aftermarket') {
        status = 'Buy Online'
        text = 'Available Now'
        colorClassName = 'before:bg-green'
      }

      if (linkType === 'Releases') {
        if ((availableFrom && dayjs(availableFrom).isBefore(now)) || (!availableFrom && released)) {
          status = 'Dropped'
          text = 'Check Site'
          colorClassName = 'before:bg-orange-500'
        } else {
          status = 'Dropping Soon'
          colorClassName = 'before:bg-red'
        }
      }

      if (linkType === 'Raffles') {
        if (!availableFrom || dayjs(availableFrom).isAfter(now) ||
          (availableTo && dayjs(availableTo).isBefore(now))
        ) {
          status = 'Closed'
          colorClassName = 'before:bg-red'
        } else {
          status = 'Open'
          colorClassName = 'before:bg-green'
        }
      }

      return {
        ...b,
        linkType,
        status,
        colorClassName,
        text
      }
    })
    return groupBy(
      sortBy(buttons, ({ linkType }) =>
        linkType === 'Releases' ? 2 : linkType === 'Raffles' ? 3 : 1
      ),
      b => b.linkType
    )
  }, [selectedRelease, releaseLinks])

  return (
    <div className='m-4 md:m-6'>
      {map(buyLinks, (links, label) => (
        <div className='mb-8 last:mb-0' key={label}>
          <Label>{label}</Label>
          <ul>
            {links?.map(({ _key, url, store, text, colorClassName, status }) => (
              <LinkItem
                to={url}
                key={_key}
                className='flex items-center justify-between '
              >
                <span className='block mr-2 w-auto md:w-1/2 group-hover:pl-2 transition-[padding] flex-grow'>
                  {store?.title}
                </span>
                <MonoTag className='block mr-8 md:mr-2 md:w-1/4 flex-grow-0 flex-shrink-0'>
                  {text}
                </MonoTag>
                <div
                  className={cn(
                    'mx-2 md:w-1/4 relative flex justify-end md:justify-between items-center flex-grow-0 flex-shrink-0',
                    'before:absolute before:h-1 before:w-1 before:-left-3 before:top-1/2 before:-translate-y-1/2 before:rounded',
                    colorClassName
                  )}
                >
                  {status && (
                    <>
                      <MonoTag className='hidden md:block'>{status}</MonoTag>
                      <ExternalLinkIcon className='ml-4 md:ml-0 w-2 h-2' />
                    </>
                  )}
                </div>
              </LinkItem>
            ))}
          </ul>
        </div>
      ))}

      {settings?.labels?.buyDialogDisclaimer && <div className='!mb-[2rem]'>
        <RichContent content={settings?.labels?.buyDialogDisclaimer} className='font-mono uppercase text-[9px] text-center m-auto max-w-[70em] text-current'/>
      </div>}
    </div>
  )
}

export default BuyLinks
