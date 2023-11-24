import { atom } from 'jotai'

const indexes = {}

const getIndexedAtom = (key, id, createAtom = () => atom()) => {
  if (!indexes[key]) {
    indexes[key] = {}
  }
  const atoms = indexes[key]
  if (!atoms[id]) {
    atoms[id] = createAtom()
  }

  return atoms[id]
}

export default getIndexedAtom
