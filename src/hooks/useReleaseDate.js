import { useAtomValue } from 'jotai'
import get from 'lodash/get'
import { useMemo } from 'react'

import { isReleased } from '../helpers/dates'
import { settingsAtom } from '../store/content'

export function useReleaseDate (page) {
  const releaseDate = page?._type === 'release' ? page?.releaseDate : get(page, ['releases', 0, 'releaseDate'])
  const releaseDateLabel = page?._type === 'release' ? page?.releaseDateLabel : get(page, ['releases', 0, 'releaseDateLabel'])
  const { labels } = useAtomValue(settingsAtom)
  const { sneakerReleased: releasedText } = labels

  return useMemo(() => {
    if (releaseDate) {
      return {
        releaseDate,
        releaseDateLabel,
        released: isReleased(releaseDate),
        releasedText
      }
    }

    return { releaseDate, releaseDateLabel }
  }, [releaseDate, releaseDateLabel, releasedText])
}
