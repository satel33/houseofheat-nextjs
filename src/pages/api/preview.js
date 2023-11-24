export default function preview (req, res) {
  if (!req.query.slug) {
    return res.status(401).json({ message: 'No slug' })
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({})

  res.writeHead(307, { Location: `/${req.query.slug}` ?? '/' })

  return res.end()
}
