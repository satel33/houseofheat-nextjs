import { useSetAtom } from 'jotai'
import { createContext, useEffect, useState } from 'react'
import {
  MENU_VIEW_PROFILE,
  profileSignInErrorAtom,
  useOpenMenuAtView
} from '../components/Menu/menuState'
import {
  authenticatedStatusAtom,
  sessionAtom,
  userProfileAtom
} from './authState'

export const FirebaseContext = createContext({ ready: false })

let firebaseRedirectRequestChecked = false

const FirebaseProvider = ({ children }) => {
  const setSession = useSetAtom(sessionAtom)
  const setUserProfile = useSetAtom(userProfileAtom)
  const setAuthenticatedStatus = useSetAtom(authenticatedStatusAtom)
  const [firebaseState, setFirebaseState] = useState({ ready: false })
  const openMenuAtView = useOpenMenuAtView()
  const setSignInErrorMessage = useSetAtom(profileSignInErrorAtom)

  useEffect(() => {
    let unregisterListener
    let unregisterProfileListener
    const initFirebase = async () => {
      const module = (await import('./firebase')).default
      const { auth, firestore } = module
      const { onAuthStateChanged, getAuth, getRedirectResult } = auth
      const { store, doc, onSnapshot, setDoc } = firestore

      setFirebaseState({
        ready: true,
        ...module
      })

      unregisterListener = onAuthStateChanged(getAuth(), async user => {
        if (user) {
          const idToken = await user.getIdToken()
          setAuthenticatedStatus('authenticated')
          setSession({
            user,
            idToken // We will use this to authenticate with the backend
          })

          unregisterProfileListener = onSnapshot(
            doc(store, 'users', user.uid),
            async userProfileRef => {
              const userProfile = userProfileRef.data()
              if (!userProfile) {
                await setDoc(
                  doc(store, 'users', user.uid),
                  {
                    followingBrands: []
                  },
                  { merge: true }
                )
              } else {
                setUserProfile({
                  uid: user.uid,
                  ...userProfileRef.data()
                })
              }
            }
          )
        } else {
          setAuthenticatedStatus('unauthenticated')
          setSession(null)
          setUserProfile(null)
          unregisterProfileListener?.()
        }
      })

      if (!firebaseRedirectRequestChecked) {
        firebaseRedirectRequestChecked = true
        try {
          const redirectResults = await getRedirectResult(getAuth())
          if (redirectResults) {
            openMenuAtView(MENU_VIEW_PROFILE)
          }
        } catch (error) {
          const errorCode = error.code
          const errorMessage = error.message
          openMenuAtView(MENU_VIEW_PROFILE)
          setSignInErrorMessage(errorMessage)
          console.error(`${errorCode} - ${errorMessage}`)
        }
      }
    }

    initFirebase()

    return () => {
      unregisterListener?.()
      unregisterProfileListener?.()
    }
  }, [setUserProfile, setAuthenticatedStatus, setSession, openMenuAtView])

  return (
    <FirebaseContext.Provider value={firebaseState}>
      {children}
    </FirebaseContext.Provider>
  )
}

export default FirebaseProvider
