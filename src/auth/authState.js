import { atom } from 'jotai'

export const sessionAtom = atom()

export const userProfileAtom = atom()

export const authenticatedStatusAtom = atom('unauthenticated')

export const providersAtom = atom([])
