import { useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { useIsAuthenticated } from '../../../auth'
import { menuView, MENU_VIEW_PROFILE } from '../menuState'

export default function Notifications () {
  const authenticated = useIsAuthenticated()
  const setMenuView = useSetAtom(menuView)

  // Safe guard: if the status changes to be unauthenticated and this view is open, set the menu view to "profile" for login.
  useEffect(() => {
    if (!authenticated) {
      setMenuView(MENU_VIEW_PROFILE)
    }
  }, [authenticated, setMenuView])

  return (
    <article className='flex-1 h-full flex flex-col gap-8 md:gap-20 px-10 pb-16 justify-between overflow-auto custom-scrollbar'>
      Notifications
      <br />
      Screen to do!
    </article>
  )
}
