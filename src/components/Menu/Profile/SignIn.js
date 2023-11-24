import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { useFirebaseContext } from '../../../auth'
import { useProfileSettings } from '../../../store/content'
import Button from '../../Button'
import RichContent from '../../RichContent'
import Heading from '../../Typography/Heading'
import { profileSignInErrorAtom } from '../menuState'

const providerNames = {
  'google.com': 'Google',
  'twitter.com': 'Twitter',
  'facebook.com': 'Facebook',
  'apple.com': 'Apple'
}

function SignIn () {
  const { loginTitle, loginCopy } = useProfileSettings()
  const [errorMessage, setErrorMessage] = useAtom(profileSignInErrorAtom)
  const firebaseContext = useFirebaseContext()

  const onSignIn = useCallback(async (provider) => {
    try {
      if (!firebaseContext.ready) return
      const { auth: { getAuth, signIn } } = firebaseContext
      const auth = getAuth()
      await signIn(auth, provider)
    } catch (error) {
      // Ignore the error when the user closes the popup
      if (error.code === 'auth/popup-closed-by-user') return
      setErrorMessage(error.message)
    }
  }, [firebaseContext])

  const providers = firebaseContext?.auth?.providers

  return (
    <div className='flex-1 h-full flex flex-col gap-6 px-10 pb-12 justify-start text-center overflow-auto custom-scrollbar'>
      <Heading as='h4'>{loginTitle}</Heading>
      <RichContent content={loginCopy} />
      {errorMessage && (
        <p className='text-update'>An error occurred, please try again. {errorMessage}</p>
      )}
      <div className='flex flex-col gap-2'>
        {providers && Object.values(providers).map(provider => (
          <Button
            key={providerNames[provider.providerId]}
            onClick={() => onSignIn(provider)}
            className='h-12 justify-center'
            withBorder
          >
            {providerNames[provider.providerId]}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default SignIn
