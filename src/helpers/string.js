import forEach from 'lodash/forEach'

export function stringify (obj) {
  const str = []
  forEach(obj, (value, key) => {
    str.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
  })
  return str.join('&')
}
