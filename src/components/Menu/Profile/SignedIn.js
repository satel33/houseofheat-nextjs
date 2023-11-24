import { useAtomValue } from 'jotai'
import { useCallback, useMemo, useState } from 'react'
import Button from '../../Button'
import Mono from '../../Typography/Mono'

import cn from 'clsx'
import { useFirebaseContext, useSession } from '../../../auth'
import { useFollowingBrandsAndModels } from '../../../hooks/useFollowingBrandsAndModels'
import AddIcon from '../../../icons/AddIcon'
import { sharedDataAtom } from '../../../store/content'

function LoggedInProfile () {
  const [showAvatar, setShowAvatar] = useState()
  const session = useSession()
  const firebaseContext = useFirebaseContext()
  const { brands: allBrands } = useAtomValue(sharedDataAtom)
  const visibleBrands = useMemo(() => allBrands.filter(({ visibleInFilters }) => visibleInFilters), [allBrands])
  const {
    followingBrands,
    toggleBrand,
    isLoading
  } = useFollowingBrandsAndModels()
  const onSignOut = useCallback(async () => {
    if (!firebaseContext.ready) return
    const {
      auth: { getAuth, signOut }
    } = firebaseContext
    try {
      const auth = getAuth()
      await signOut(auth)
    } catch (error) {
      console.error('Sign out error', error)
    }
  }, [firebaseContext])

  const name = session?.user?.displayName || session?.user?.email
  const photoUrl = session?.user?.photoURL
  const onImageLoadError = useCallback(() => {
    setShowAvatar(true)
  }, [session])

  return (
    <div className='flex-1 h-full flex flex-col gap-6 pt-10 px-4 pb-0 overflow-auto custom-scrollbar'>
      <section className='flex flex-col items-center gap-3'>
        <div className='rounded-full overflow-hidden flex justify-center items-center w-20 h-20 bg-neutral-200'>
          {photoUrl && !showAvatar && (
            <img
              alt={session?.user?.displayName}
              src={photoUrl}
              loading='lazy'
              className='w-20 h-20'
              onError={onImageLoadError}
            />
          )}
          {(!photoUrl || showAvatar) && (
            <div className='text-lg'>
              {session?.user?.displayName.substring(0, 1) || 'U'}
            </div>
          )}
        </div>
        <div className='text-center'>
          <p className='text-lg leading-[1.3] tracking-[-0.01em]'>{name}</p>
          {/* <button className='hover:opacity-50' onClick={onEdit}>
            <Mono>Edit profile</Mono>
          </button> */}
        </div>
      </section>
      <section className='flex-1'>
        <header className='flex justify-between items-center py-4 text-md border-b border-b-neutral-500'>
          <p>Brands you follow</p>
          <span>{followingBrands?.length ?? 0}</span>
        </header>
        <div className='flex flex-wrap py-6 gap-x-2 gap-y-3'>
          {visibleBrands.map(brand => {
            const isFollowing = followingBrands?.includes(brand._id)
            const onClick = () => toggleBrand(brand._id)

            return (
              <button
                key={brand._id}
                disabled={isLoading}
                onClick={onClick}
                className={cn(
                  'group flex items-center gap-2 px-3 h-[30px] rounded-full disabled:opacity-30',
                  isFollowing
                    ? 'border border-white bg-gradient-to-bl from-lime-300 to-cyan-400 hover:from-cyan-400 hover:to-lime-300'
                    : 'border border-gray-300 hover:bg-gradient-to-bl hover:from-lime-300 hover:to-cyan-400 hover:border-white'
                )}
              >
                <Mono>{brand.title}</Mono>
                <AddIcon className='shrink-0 grow-0 w-2 h-2' on={isFollowing} />
              </button>
            )
          })}
        </div>
      </section>
      <Button
        className='w-full justify-center rounded-full py-5 text-sm gap-2 font-mono'
        withBorder
        onClick={onSignOut}
      >
        Log out
      </Button>
    </div>
  )
}

export default LoggedInProfile
