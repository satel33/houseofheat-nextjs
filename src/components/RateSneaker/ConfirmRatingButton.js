import cn from 'clsx'
import { useAtom, useSetAtom } from 'jotai'
import { forwardRef, useCallback, useState } from 'react'
import { useFirebaseContext, useIsAuthenticated, useSession } from '../../auth'
import Mono from '../Typography/Mono'
import { isRateSneakerDialogOpen, isSubmittingRating } from './rateSneakerState'

const ConfirmRatingButton = forwardRef(({
  rating,
  confirmText = 'Confirm Rating',
  className,
  page
}, ref) => {
  const [submitting, setSubmitting] = useAtom(isSubmittingRating)
  const [error, setError] = useState()
  const setOpen = useSetAtom(isRateSneakerDialogOpen)
  const firebaseContext = useFirebaseContext()
  const { user } = useSession()
  const authenticated = useIsAuthenticated()

  const onConfirmRating = useCallback(() => {
    const post = async () => {
      if (!authenticated) return
      setSubmitting(true)
      const {
        firestore: { store, doc, setDoc }
      } = firebaseContext
      try {
        try {
          await setDoc(doc(store, `users/${user.uid}/ratings`, page._id), {
            rating: rating * 100
          })
          setOpen(false)
          setError(null)
        } catch (error) {
          setError(error.toString())
          console.error(error)
        }
      } finally {
        setSubmitting(false)
      }
    }
    post()
  }, [
    authenticated,
    setSubmitting,
    firebaseContext,
    user,
    page,
    rating,
    setOpen
  ])

  const text = submitting ? 'Hold tight...' : error || confirmText

  return (
    <button
      ref={ref}
      onClick={onConfirmRating}
      className={cn(
        submitting && 'bg-black',
        className,
        'block w-full md:w-auto text-center border-y-[1px] md:border-[1px] py-5 px-[51px] m-auto md:mt-[-30vh] md:mb-[30vh] bg-transparent text-white transition duration-150 ease-in-out hover:bg-[rgba(255,255,255,1)] hover:text-black'
      )}
      disabled={submitting}
    >
      <Mono>{text}</Mono>
    </button>
  )
})

export default ConfirmRatingButton
