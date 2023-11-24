import { useCallback } from 'react'
import debounce from 'lodash/debounce'

const DEFAULT_OPTIONS = { leading: false, trailing: true }

export function useDebouncedCallback (
  fn,
  wait = 200,
  dependencies = [],
  options = DEFAULT_OPTIONS
) {
  return useCallback(debounce(fn, wait, options), dependencies)
}
