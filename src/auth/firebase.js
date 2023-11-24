import { initializeApp } from 'firebase/app'

import {
  browserLocalPersistence, browserPopupRedirectResolver, browserSessionPersistence, FacebookAuthProvider, getAuth, getRedirectResult, GoogleAuthProvider, indexedDBLocalPersistence, initializeAuth, OAuthProvider, onAuthStateChanged, signInWithPopup,
  signInWithRedirect, signOut, TwitterAuthProvider
} from 'firebase/auth'

import {
  doc, getFirestore, onSnapshot,
  setDoc
} from '@firebase/firestore/lite'
import { primaryInput } from 'detect-it'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
}

// const analytics = getAnalytics(app)

export const app = initializeApp(firebaseConfig)
// export const auth = getAuth(app)
export const auth = initializeAuth(app, {
  persistence: [
    indexedDBLocalPersistence,
    browserLocalPersistence,
    browserSessionPersistence
  ]
})

export const firestore = getFirestore(app)

const googleProvider = new GoogleAuthProvider()

const twitterProvider = new TwitterAuthProvider()

const facebookProvider = new FacebookAuthProvider()
if (primaryInput === 'touch') {
  facebookProvider.setCustomParameters({
    display: 'popup'
  })
}

const applyProvider = new OAuthProvider('apple.com')
applyProvider.addScope('email')
applyProvider.addScope('name')

export const providers = [
  googleProvider,
  // TODO: Uncomment this when we have the other providers setup with the correct redirect url. We need to add https://houseofheat.co/__/auth/handler redirect url.
  // See the task https://app.asana.com/0/1200850842298603/1204222176429109 for more information
  twitterProvider
  // facebookProvider,
  // applyProvider
]

// I export a subset of functions for each firebase project so they are tree shaken
// And i load this dynamically from the firebase provider
const api = {
  app,
  firestore: {
    store: firestore,
    doc,
    onSnapshot,
    setDoc
  },
  auth: {
    getAuth,
    onAuthStateChanged,
    signOut,
    getRedirectResult: async () => {
      return getRedirectResult(getAuth(), browserPopupRedirectResolver)
    },
    signIn: async (auth, provider) => {
      // TODO: should we use the popup method on desktop and redirect method on mobile?
      if (primaryInput === 'touch') {
        signInWithRedirect(auth, provider, browserPopupRedirectResolver)
      } else {
        await signInWithPopup(auth, provider, browserPopupRedirectResolver)
      }
    },
    providers
  }
}

export default api
