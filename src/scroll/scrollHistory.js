const storage = {}

// Not sure i want this in the session
const STORE_IN_SESSION = false

export default class ScrollHistory {
  constructor (key) {
    this.sessionKey = key
  }

  set (key, path, value) {
    const k = `${this.sessionKey}-${key}`
    const obj = { path, y: isNaN(value) ? 0 : value }
    if (STORE_IN_SESSION) {
      window.sessionStorage.setItem(k, JSON.stringify(obj))
    } else {
      storage[k] = obj
    }
  }

  get (key, currentPath) {
    const k = `${this.sessionKey}-${key}`
    let objValue = null
    if (STORE_IN_SESSION) {
      try {
        const jsonValue = window.sessionStorage.getItem(k)
        if (jsonValue) {
          objValue = JSON.parse(jsonValue)
        }
      } catch (e) {}
    } else {
      objValue = storage[k]
    }

    if (!objValue) return 0
    const { path, y } = objValue
    if (currentPath !== path || !y) return 0
    return y
  }
}
