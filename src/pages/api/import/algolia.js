import groq from 'groq'
import transform from '../../../lib/algolia/transformers'

import { getAlgoliaIndex } from '../../../lib/algolia'
import { createPageQuery } from '../../../lib/queries/createPageQuery'
import createSanityClient from '../../../lib/sanity'

const client = createSanityClient(process.env.SANITY_USE_CDN === 'true')

// We will import these document types onto different Algolia indexes!
// const types = ['page', 'release']
const types = ['page', 'release']

const batch = async (res, index, query, pageIndex, limit, total, recursive) => {
  const totalPages = Math.ceil(total / limit)
  const message = `Importing content: ${pageIndex + 1}/${totalPages}\n`
  res.write(message)

  const rawDocuments = await client.fetch(groq`${query}[$offset...$limit]`, {
    offset: pageIndex * limit,
    limit: pageIndex * limit + limit
  })

  const documents = await transform(rawDocuments)

  await index.saveObjects(documents)

  // Has more pages
  if (recursive && pageIndex + 2 <= totalPages) {
    await batch(res, index, query, pageIndex + 1, limit, total, recursive)
  }
}

const handler = async (req, res) => {
  // This is only for development purposes
  if (process.env.NODE_ENV !== 'development') {
    res.end()
    return
  }
  const page = parseInt(req.query.page || 0)
  const clear = req.query.clear
  let total = 0

  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Encoding': 'none',
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    'Access-Control-Allow-Origin': '*'
  })

  res.on('close', () => {
    console.log('client dropped me')
    res.end()
  })

  for (const type of types) {
    const algoliaIndex = getAlgoliaIndex(type)

    // Clearing the index
    if (clear) {
      res.write(`Clearing the "${type}s" index...\n`)
      try {
        await algoliaIndex.clearObjects()
        res.write('Index cleared\n')
      } catch (e) {
        console.error(e)
        res.write(`\n\n-------------------------\n\nERROR: ${e.toString()}\n`)
        res.end()
        return
      }
    }

    // Batching queries
    const query = groq`*[!(_id in path('drafts.**')) && _type == '${type}']`

    total = await client.fetch(groq`count(${query})`)

    try {
      res.write(`Starting batch job for ${total} total document and ${Math.ceil(total / 50)} pages for ${type}...\n`)
      await batch(res, algoliaIndex, `${query} { ${createPageQuery()} }`, page, 50, total, true)
    } catch (e) {
      console.error(e)
      res.write(`\n\n-------------------------\n\nERROR: ${e.toString()}\n`)
      res.end()
      return
    }
  }

  const result = {
    status: 'OK',
    message: 'Index updated',
    page,
    clear,
    total,
    pages: Math.ceil(total / 50)
  }

  res.write(`result: ${JSON.stringify(result)}\n\n`)
  res.end()
}

export default handler
