import React, { useMemo } from 'react'

import cn from 'clsx'
import { useAtomValue } from 'jotai'
import isEmpty from 'lodash/isEmpty'
import { brandsForFiltering } from '../../store/content.js'
import Filters from './index.js'

export default function BrandFilters ({ className, brand, onBrandSelected, label = 'Filter', labelClassName, ...props }) {
  const brands = useAtomValue(brandsForFiltering)
  const hasBrands = !isEmpty(brands)

  const selectedBrand = useMemo(() => {
    return brands?.find(x => x._id === brand)
  }, [brands, brand])

  if (!hasBrands) return null

  return (
    <Filters
      className={className}
      filters={brands}
      selectedFilters={brand ? [brand] : []}
      onToggleFilterId={onBrandSelected}
      label={
        <span className='whitespace-nowrap flex'>
          <span className={cn('inline-flex', labelClassName)}>{label}</span>{' '}
          <span className='w-[3.5em] ml-2 inline-block overflow-hidden text-ellipsis text-left'>{selectedBrand ? selectedBrand.title : 'Brand'}</span>
        </span>
      }
      {...props}
    />
  )
}
