import { useEffect, useState } from 'react'
import { useFirebaseContext, useIsAuthenticated, useSession } from '../../auth'

export default function useCurrentUsersRating (page) {
  const isAuthenticated = useIsAuthenticated()
  const firebaseContext = useFirebaseContext()
  const { user } = useSession()
  const [rating, setRating] = useState(0.5)
  const [rated, setRated] = useState(false)

  useEffect(() => {
    setRating(0.5)
    if (!isAuthenticated || !firebaseContext?.firestore) {
      return
    }
    const { firestore: { store, doc, onSnapshot } } = firebaseContext
    const unregisterListener = onSnapshot(
      doc(store, `users/${user.uid}/ratings`, page._id),
      async (ratingRef) => {
        const r = ratingRef.data()?.rating
        if (r) setRated(true)
        setRating(r ? r / 100 : 0.5)
      }
    )

    return () => {
      unregisterListener()
    }
  }, [user, page, firebaseContext, isAuthenticated])

  return {
    rating,
    rated
  }
}
