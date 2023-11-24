
import addToIndex from '../../lib/algolia/methods/addToIndex'
import removeFromIndex from '../../lib/algolia/methods/removeFromIndex'
import pick from 'lodash/pick'
import secureWebhook from './_secureWebhook'

const handler = async (req, res) => {
  const ids = [req.body._id]

  try {
    // DELETE
    if (req.method === 'DELETE') {
      await removeFromIndex(ids)
      res.json({
        status: 'OK',
        message: 'Item removed from index',
        requestBody: req.body._id
      })
      return
    }

    // ADD
    const documents = await addToIndex(ids)
    res.json({
      status: 'OK',
      message: 'Index updated',
      documents: {
        added: documents.added.map(doc => (pick(doc, ['_id', 'title', 'slug']))),
        removed: documents.removed.map(doc => (pick(doc, ['_id', 'title', 'slug'])))
      },
      requestBody: req.body._id
    })
  } catch (e) {
    res.status(500).json({
      status: 'Error',
      message: e.toString(),
      requestBody: req.body
    })
  }
}

export default secureWebhook(handler)
