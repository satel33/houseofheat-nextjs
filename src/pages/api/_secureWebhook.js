const secureWebhook = (handler) => (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    const sanityWebhookKey = req.headers['x-sanity-webhook-key']
    if (sanityWebhookKey !== process.env.SANITY_WEBHOOK_SECRET) {
      res.status(401).json({ status: 'Forbidden' })
      return
    }
  }
  return handler(req, res)
}

export default secureWebhook
