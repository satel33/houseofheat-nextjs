import { SECRET_INTERNAL_getScopeContext as getScopeContext } from 'jotai'
import { useContext } from 'react'
import { inBrowser } from '../helpers/browser'

const hydratedMap = new WeakMap()

export function useSSRHydrateAtoms (values, scope) {
  const ScopeContext = getScopeContext(scope)
  const scopeContainer = useContext(ScopeContext)
  const store = scopeContainer.s

  const hydratedSet = getHydratedSet(scopeContainer)
  const tuplesToRestore = []
  for (const tuple of values) {
    const atom = tuple[0]
    if (!hydratedSet.has(atom)) {
      hydratedSet.add(atom)
      tuplesToRestore.push(tuple)
    }
  }
  if (tuplesToRestore.length) {
    store.h(tuplesToRestore)
  }
}

function getHydratedSet (key) {
  let hydratedSet = hydratedMap.get(key)
  if (!hydratedSet || !inBrowser()) {
    hydratedSet = new WeakSet()
    hydratedMap.set(key, hydratedSet)
  }
  return hydratedSet
}
