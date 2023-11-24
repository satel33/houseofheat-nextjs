import isEmpty from 'lodash/isEmpty'

import { getAlgoliaIndex } from '../index'

export default async function removeFromIndex (ids) {
  if (isEmpty(ids)) return ids

  const filters = ids.map(id => `objectID:${id}`).join(' OR ')
  await getAlgoliaIndex().deleteBy({ filters })
  await getAlgoliaIndex('release').deleteBy({ filters })

  return ids
}
