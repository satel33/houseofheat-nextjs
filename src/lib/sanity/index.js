import { createClient } from 'next-sanity'

export default function createSanityClient (useCdn) {
  return createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_PROJECT_DATASET,
    token: process.env.SANITY_API_TOKEN,
    useCdn,
    apiVersion: '2021-06-07'
  })
}
