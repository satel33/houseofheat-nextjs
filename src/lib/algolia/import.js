import groq from 'groq'
import isEmpty from 'lodash/isEmpty'
import ora from 'ora'

import { createPageQuery } from '../../lib/queries/createPageQuery'
import createSanityClient from '../sanity'
import options from './cli/options'
import usage from './cli/usage'
import { getAlgoliaIndex } from './index'
import addToIndex from './methods/addToIndex'
import removeFromIndex from './methods/removeFromIndex'
import transform from './transformers'

// Global variables
let spinner = {}
let total = 0
let interrupted = false

// We will import these document types onto different Algolia indexes!
const types = ['page', 'release']

// On stop, mark the script as interruped (will be used below)
process.on('SIGINT', () => {
  interrupted = true
})

// Sanity client
const client = createSanityClient(process.env.SANITY_USE_CDN === 'true')

const batch = async (index, query, pageIndex, limit) => {
  const totalPages = Math.ceil(total / limit)

  spinner = ora(`Importing content: ${pageIndex + 1}/${totalPages}`).start()
  spinner.text = `${pageIndex + 1}/${totalPages}: Fetching content...`
  const rawDocuments = await client.fetch(groq`${query}[$offset...$limit]`, {
    offset: pageIndex * limit,
    limit: pageIndex * limit + limit
  })

  spinner.text = `${pageIndex + 1}/${totalPages}: Transforming content...`
  const documents = await transform(rawDocuments)

  spinner.text = `${pageIndex + 1}/${totalPages}: Add content to index...`
  try {
    await index.saveObjects(documents)
  } catch (e) {
    spinner.fail(
      `Oops, something has gone wrong whilst saving content:\n${e.message}`
    )
  }

  if (interrupted) {
    return spinner.fail('Batch import interrupted.')
  }

  // Has more pages
  if (pageIndex + 2 <= totalPages) {
    spinner.succeed(`Importing content: ${pageIndex + 1}/${totalPages} done.`)
    await batch(index, query, pageIndex + 1, limit)
  }
}

const full = async () => {
  spinner = ora('Running full import...').start()

  // For each `type`, clear the associated index and batch the queries
  for (const type of types) {
    const algoliaIndex = getAlgoliaIndex(type)

    // Clearing the index
    spinner.text = `Clearing the "${type}s" index...`
    try {
      await algoliaIndex.clearObjects()
      spinner.succeed('Index cleared')
    } catch (e) {
      spinner.fail(`Oops, something has gone wrong:\n${e.message}`)
    }

    // Batching queries
    spinner.text = `Getting the total of ${type}s from Sanity...`
    const query = groq`*[!(_id in path('drafts.**')) && _type == '${type}']`

    total = await client.fetch(groq`count(${query})`)

    spinner.text = `Starting batch job for ${total} total ${type}s...`
    try {
      await batch(algoliaIndex, `${query} { ${createPageQuery()} }`, 0, 50)
      spinner.succeed('Index updated')
    } catch (e) {
      spinner.fail(
        `Oops, something has gone wrong in the batch update:\n${e.message}`
      )
    }
  }
}

const add = async ids => {
  const txt =
    ids.length === 1 ? `document ${ids[0]}` : `${ids.length} documents`
  spinner = ora(`Adding ${txt} to the index...`).start()
  await addToIndex(ids)
  spinner.succeed('Index updated')
}

const remove = async ids => {
  const txt =
    ids.length === 1 ? `document ${ids[0]}` : `${ids.length} documents`
  spinner = ora(`Removing ${txt} from the index...`).start()
  await removeFromIndex(ids)
  spinner.succeed('Index updated')
}

const clear = async (type = 'page') => {
  spinner = ora(`Clearing index "${type}s"...`).start()
  await getAlgoliaIndex(type).clearObjects()
  spinner.succeed('Index updated')
}

const run = async () => {
  if (isEmpty(options)) {
    console.log(usage)
    return
  }

  try {
    for (const [key, value] of Object.entries(options)) {
      switch (key) {
        case 'add': {
          await add(value)
          break
        }
        case 'remove': {
          await remove(value)
          break
        }
        case 'clear': {
          await clear(value)
          break
        }
        case 'full': {
          await full(value)
          break
        }
        case 'help': {
          console.log(usage)
          break
        }
      }
    }
  } catch (e) {
    spinner?.fail(e.toString() + '\n' + e.stack)
    throw e
  }
}

run()
