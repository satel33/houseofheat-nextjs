export const pageview = (url, title) => {
  if (!window.dataLayer) window.dataLayer = []
  window.dataLayer?.push({
    event: 'pageview',
    page_path: url,
    page_title: title || document.title,
    page_location: window.location.href
  })
}
