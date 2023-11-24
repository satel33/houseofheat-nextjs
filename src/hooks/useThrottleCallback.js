import { useCallback } from 'react'
import throttle from 'lodash/throttle'

const DEFAULT_OPTIONS = { leading: false, trailing: true }
const useThrottleCallback = (fn, wait = 200, dependencies = [], options = DEFAULT_OPTIONS) => useCallback(throttle(fn, wait, options), dependencies) /* eslint-disable-line */

export default useThrottleCallback
