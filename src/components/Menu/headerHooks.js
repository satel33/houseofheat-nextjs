import gsap from 'gsap'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useAtomCallback } from 'jotai/utils'
import remove from 'lodash/remove'
import { createRef, useCallback, useContext, useEffect, useRef } from 'react'
import { getForegroundColorFromBackgroundColor, isColorDark } from '../../helpers/colors'
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback'
import { useIsHomepage } from '../../hooks/useIsHomepage'
import useScrollYRef from '../../hooks/useScrollYRef'
import useWindowResize from '../../hooks/useWindowResize'
import { dialogOpenAtom } from '../../store/content'
import colors from '../../theme/colors.cjs'
import screens from '../../theme/screens.cjs'
import { DialogContext } from '../Dialog'
import { headerColors, writeHeaderState } from './headerState'
import { isMenuOpen } from './menuState'

const SCROLL_OFFSET = 0

let elements = []

const headerRef = createRef()

const defaultColors = {
  foreground: colors.black,
  background: colors.white
}

function getElementOffset (el) {
  let top = 0
  let left = 0
  let element = el
  do {
    top += element.offsetTop || 0
    left += element.offsetLeft || 0
    element = element.offsetParent
  } while (element)

  return { top, left }
}

const createElement = (ref, color, inDialog) => {
  const rect = ref.current.getBoundingClientRect()
  const offsetTop = getElementOffset(ref.current).top - 96
  return {
    ref,
    color,
    offsetTop,
    offsetBottom: offsetTop + rect.height,
    inDialog
  }
}

const initLayout = () => {
  elements = elements.map(({ ref, color }) => {
    return createElement(ref, color)
  })
}

export function useHeaderColor () {
  const menuOpen = useAtomValue(isMenuOpen)
  const [colors, setHeaderColors] = useAtom(headerColors)
  const localsRef = useRef({ menuClosed: !menuOpen })

  const getHeaderColorsCallback = useAtomCallback(useCallback(get => {
    return get(headerColors)
  }, []))

  const getDialogOpen = useAtomCallback(useCallback(get => {
    return get(dialogOpenAtom)
  }, []))

  useWindowResize(useDebouncedCallback(initLayout, 200, []), false, true)

  const scrollYRef = useScrollYRef()

  useEffect(() => {
    initLayout()
    let animationId
    const loop = async () => {
      const dialogOpen = await getDialogOpen()
      const y = scrollYRef.current.y
      const intersectingElement = elements
        .filter(e => (e.inDialog && dialogOpen) || (!e.inDialog && !dialogOpen)) // Filters out the elements that are in a dialog
        .find(
          ({ offsetTop, offsetBottom }) => y >= offsetTop && y < offsetBottom
        )
      const currentColor = await getHeaderColorsCallback()
      const nextColors = localsRef.current.menuClosed && intersectingElement
        ? intersectingElement.color
        : defaultColors

      if (nextColors.foreground !== currentColor.foreground ||
        nextColors.background !== currentColor.background) {
        setHeaderColors(nextColors)
      }
      animationId = window.requestAnimationFrame(loop)
    }
    loop()
    return () => {
      window.cancelAnimationFrame(animationId)
    }
  }, [getHeaderColorsCallback, setHeaderColors])

  useEffect(() => {
    if (menuOpen) {
      localsRef.current.menuClosed = false
    } else {
      // I want to delay the changing of the header color when the menu closes so it looks better
      const timeout = setTimeout(() => {
        localsRef.current.menuClosed = true
      }, 300)
      return () => {
        clearTimeout(timeout)
      }
    }
  }, [menuOpen])

  const { foreground, background } = colors
  const currentColor = useRef({ ...defaultColors })
  useEffect(() => {
    const root = headerRef.current || document.documentElement
    gsap.to(currentColor.current, {
      foreground,
      background,
      duration: 0.25,
      ease: 'sine.inOut',
      onUpdate: () => {
        root.style.setProperty('--foreground', currentColor.current.foreground)
        root.style.setProperty('--background', currentColor.current.background)
      }
    })
  }, [foreground, background])

  return { headerRef, color: currentColor }
}

export function useAttachHeaderEvents () {
  const isHomepage = useIsHomepage()
  const setHeaderState = useSetAtom(writeHeaderState)
  const getMenuOpen = useAtomCallback(useCallback(get => get(isMenuOpen), []))
  const scrollYRef = useScrollYRef()
  const windowSizeRef = useWindowResize(null, false, true)

  useEffect(() => {
    let animationId
    let previousY = null
    let previousMenuOpen = false
    const loop = async () => {
      // Only set the state here if we are changing the scroll from the top of the page
      const menuOpen = await getMenuOpen()
      if (
        previousY === null ||
        (previousY <= SCROLL_OFFSET && scrollYRef.current.y > SCROLL_OFFSET) ||
        (scrollYRef.current.y <= SCROLL_OFFSET && previousY > SCROLL_OFFSET) ||
        previousMenuOpen !== menuOpen
      ) {
        setHeaderState({
          expanded: !menuOpen && scrollYRef.current.y <= SCROLL_OFFSET,
          large: !menuOpen && scrollYRef.current.y <= SCROLL_OFFSET && (isHomepage || windowSizeRef.current.width <= parseInt(screens.md))
        })
      }
      previousMenuOpen = menuOpen
      previousY = scrollYRef.current.y
      animationId = window.requestAnimationFrame(loop)
    }
    loop()
    return () => {
      window.cancelAnimationFrame(animationId)
    }
  }, [isHomepage, getMenuOpen, setHeaderState])
}

export function useRegisterHeaderColorSwitcher (
  background,
  active = true
) {
  const ref = useRef()
  const dialogContext = useContext(DialogContext)
  useEffect(() => {
    if (background && active) {
      const foreground = getForegroundColorFromBackgroundColor(background)
      elements.push(
        createElement(
          ref,
          {
            background: isColorDark(foreground) ? colors.white : colors.black,
            foreground
          },
          dialogContext?.inDialog
        )
      )
      return () => {
        remove(elements, r => r.ref === ref)
      }
    }
  }, [dialogContext, background, active])
  return ref
}
