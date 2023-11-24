import { useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { isRateSneakerDialogOpen } from './RateSneaker/rateSneakerState'

import { useIsAuthenticated } from '../auth'
import {
  MENU_VIEW_PROFILE,
  useOpenMenuAtView
} from '../components/Menu/menuState'
import Button from './Button'
import useCurrentUsersRating from './RateSneaker/useCurrentUsersRating'

export default function RateSneakerButton ({
  text = 'Rate This Release',
  page,
  ...props
}) {
  const authenticated = useIsAuthenticated()
  const openMenu = useOpenMenuAtView()
  const { rated, rating } = useCurrentUsersRating(page)

  const setRateSneakerDialogOpen = useSetAtom(isRateSneakerDialogOpen)
  const onClick = useCallback(
    e => {
      if (!authenticated) {
        openMenu(MENU_VIEW_PROFILE)
      } else {
        setRateSneakerDialogOpen(true)
      }
      e.stopPropagation()
    },
    [authenticated]
  )

  return (
    <Button onClick={onClick} {...props}>
      {rated && (
        <span>
          Your rating
          <span className='inline-block ml-2 md:ml-4 opacity-50'>{(Math.round(rating * 1000) / 10).toFixed(1)}°</span>
        </span>
      )}
      {!rated && text}
    </Button>
  )
}
