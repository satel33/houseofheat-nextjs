import { useAtomValue } from 'jotai'
import { useContext } from 'react'
import { authenticatedStatusAtom, sessionAtom } from './authState'
import { FirebaseContext } from './FirebaseProvider'

export const useSession = () => {
  return useAtomValue(sessionAtom) || {}
}

export const useIsAuthenticated = () => {
  return useAtomValue(authenticatedStatusAtom) === 'authenticated'
}

export const useFirebaseContext = () => {
  return useContext(FirebaseContext)
}
