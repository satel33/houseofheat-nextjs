import { atom } from 'jotai'

// https://github.com/pmndrs/jotai/blob/main/docs/advanced-recipes/atom-creators.mdx#atomwithtoggle
export function atomWithToggle (initialValue) {
  const anAtom = atom(initialValue, (get, set, nextValue) => {
    const update = nextValue ?? !get(anAtom)
    set(anAtom, update)
  })

  return anAtom
}

// Helper: create an atom that toggles another original atom
export function createTogglingAtom (originalAtom) {
  return atom(
    get => get(originalAtom),
    (get, set, id) => {
      const ids = get(originalAtom)
      const newIds = ids.includes(id)
        ? [...ids.filter(f => f !== id)]
        : [...ids, id]
      set(originalAtom, newIds)
    }
  )
}
