export function getFacebookShareURL (url) {
  return `https://www.facebook.com/sharer/sharer.php?u=${url}`
}

export function getTwitterShareURL (url) {
  return `https://www.twitter.com/share?url=${url}`
}

export function getWhatsappShareURL (url) {
  return `whatsapp://send?text=${url}`
}

export function getEmailShareURL (url) {
  return `mailto:?body=${url}`
}
