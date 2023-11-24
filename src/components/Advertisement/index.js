import FreestarAdSlot from '@freestar/pubfig-adslot-react-component'
import cn from 'clsx'
import { useAtomValue } from 'jotai'
import compact from 'lodash/compact'
import { useId, useMemo, useRef } from 'react'
import { settingsAtom } from '../../store/content'

const AD_SIZE = {
  banner: {
    className: 'min-h-[250px] md:min-h-[250px]',
    placementName: 'houseofheat-co_incontent'
  },
  largeBanner: {
    className: 'min-h-[250px] md:min-h-[250px]',
    placementName: 'houseofheat-co_article_large_banner'
  },
  header: {
    className: 'min-h-[90px]',
    placementName: 'houseofheat-co_header_banner'
  },
  tile: {
    className: 'min-h-[250px] md:min-h-[250px]',
    placementName: 'houseofheat-co_article_incontent'
  },
  gridTile1: {
    className: 'min-h-[250px] xl:min-h-[250px]',
    placementName: 'houseofheat-co_hompage_grid_tile_1'
  },
  gridTile2: {
    className: 'min-h-[250px] md:min-h-[250px] xl:min-h-[250px]',
    placementName: 'houseofheat-co_hompage_grid_tile_2'
  }
}

export default function Advertisement ({
  className,
  bottomMargin = true,
  background = true,
  border = false,
  size,
  data,
  page
}) {
  const id = `ad-${useId()}`
  const settings = useAtomValue(settingsAtom)
  const containerRef = useRef()

  const { adClassName, publisher, placementName, targeting, channel } = useMemo(() => {
    const adSize = AD_SIZE[size] || AD_SIZE[data?.size] || AD_SIZE.banner
    return {
      publisher: data?.publisher || page?.ads?.publisher || settings.ads?.publisher,
      placementName: data?.size === 'other' ? data.placementName : adSize.placementName,
      targeting: data?.targeting || page?.ads?.targeting || settings?.ads?.targeting,
      channel: data?.channel || page?.ads?.channel || settings?.ads?.channel,
      adClassName: adSize?.className
    }
  }, [data, page, settings, size])

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden',
        bottomMargin && 'mb-16 md:mb-20',
        background && 'bg-neutral-50 px-2 py-[16px]',
        border && 'border-[1px] border-solid border-neutral-500',
        className
      )}
      ref={containerRef}
    >
      <FreestarAdSlot
        publisher={publisher}
        placementName={placementName}
        slotId={id}
        targeting={targeting}
        channel={channel}
        classList={compact([adClassName, 'flex justify-center items-center'])}
      />
    </div>
  )
}
