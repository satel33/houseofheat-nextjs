export const sanityConfig = {
  dataset: process.env.SANITY_PROJECT_DATASET || 'production',
  projectId: process.env.SANITY_PROJECT_ID,
  useCdn:
    !process.env.SANITY_API_TOKEN && process.env.NODE_ENV === 'production',
  apiVersion: '2021-06-07',
  token: process.env.SANITY_API_TOKEN
}
