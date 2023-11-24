import { atom } from 'jotai'
import deepEqual from 'fast-deep-equal'
import colors from '../../theme/colors.cjs'

export const headerColors = atom({
  foreground: colors.black,
  background: colors.white
})
headerColors.debugLabel = 'headerColors'

export const headerState = atom({
  large: false,
  expanded: true
})
headerState.debugLabel = 'headerState'

export const writeHeaderState = atom(null, (get, set, update) => {
  set(headerState, prev => {
    const newState = {
      ...prev,
      ...update
    }
    if (deepEqual(newState, prev)) return prev
    return newState
  })
})
