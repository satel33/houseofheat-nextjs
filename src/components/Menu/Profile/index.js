import dynamic from 'next/dynamic.js'
import React from 'react'
import { useIsAuthenticated } from '../../../auth'

const SignIn = dynamic(() => import('./SignIn'))
const SignedIn = dynamic(() => import('./SignedIn'))

export default function Profile () {
  const authenticated = useIsAuthenticated()

  if (!authenticated) {
    return <SignIn />
  }

  return <SignedIn />
}
