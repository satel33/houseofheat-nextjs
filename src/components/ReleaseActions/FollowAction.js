import cn from 'clsx'
import compact from 'lodash/compact'
import isEmpty from 'lodash/isEmpty'
import uniqBy from 'lodash/uniqBy'
import { useCallback, useMemo } from 'react'
import { useFollowingBrandsAndModels } from '../../hooks/useFollowingBrandsAndModels'
import AddIcon from '../../icons/AddIcon'
import Button from '../Button'
import DropDown from '../DropDown'

const FollowBrandModelButton = ({
  brandOrModel,
  className,
  withBorder = true
}) => {
  const { _id, _type, title } = brandOrModel
  const {
    followingBrands,
    followingModels,
    toggleBrand,
    toggleModel
  } = useFollowingBrandsAndModels()
  const toggle = _type === 'model' ? toggleModel : toggleBrand
  const following = _type === 'model' ? followingModels : followingBrands

  const isFollowing = useMemo(() => following?.includes(_id), [following, _id])

  const onClick = useCallback(() => {
    toggle(_id)
  }, [toggle, _id])

  return (
    <Button
      className={cn('h-8 px-3 gap-2 flex justify-between', className)}
      withBorder={withBorder}
      onClick={onClick}
    >
      <span className='font-mono uppercase text-xs'>{title}</span>
      <AddIcon className='w-[10px]' on={isFollowing} />
    </Button>
  )
}

export default function FollowAction ({ releases, className, classNames }) {
  const brands = useMemo(
    () =>
      uniqBy(
        compact([
          ...(releases.map(r => r.brand) || []),
          ...(releases.map(r => r.model) || [])
        ]),
        x => x._id
      ),
    [releases]
  )

  if (isEmpty(brands)) return null

  return (
    <DropDown
      className={className}
      label='Follow'
      buttonText='Follow'
      expandOnDesktop
      containerClassName='flex flex-wrap gap-2'
      classNames={classNames || { label: 'opacity-0 md:opacity-100 text-xs mb-2', buttonText: 'text-xs' }}
    >
      {brands.map(brand => (
        <FollowBrandModelButton
          key={brand._id}
          brandOrModel={brand}
          className='border-none md:border-solid flex justify-between w-full md:w-auto'
        />
      ))}
    </DropDown>
  )
}
