export const getTrending = async () => {
  return window.fetch('/api/trending')
}
