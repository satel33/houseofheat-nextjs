import cn from 'clsx'
import gsap from 'gsap'
import { useCallback, useEffect } from 'react'

import useBodyScrollLock from '../../hooks/useBodyScrollLock'
import useComposeRefs from '../../hooks/useComposeRefs'
import ClientOnlyPortal from '../ClientOnlyPortal'
import Heading from '../Typography/Heading'
import Mono from '../Typography/Mono'
import useGradient from './useGradient'

function MobileFilters ({
  className,
  filters,
  selectedFilters,
  onClose,
  onToggleFilterId,
  gradientColorFrom,
  gradientColorTo,
  isOpen,
  closeOnSelected = true
}) {
  const bodyScrollRef = useBodyScrollLock(isOpen)
  const filtered = selectedFilters?.length > 0

  // Use a "global" gradient for the filters that are selected (or all of them if no filtering)
  const tagsWithGradient = filtered ? selectedFilters : filters.map(f => f._id)
  const containerRef = useGradient(
    true,
    tagsWithGradient,
    gradientColorFrom,
    gradientColorTo
  )

  useEffect(() => {
    gsap.to(containerRef.current, {
      y: isOpen ? 0 : '100%',
      duration: 0.8,
      ease: isOpen ? 'power3.inOut' : 'expo.out',
      overwrite: true
    })
    gsap.to(containerRef.current.querySelectorAll('ul li > *'), {
      y: isOpen ? 0 : 20,
      autoAlpha: isOpen ? 1 : 0,
      duration: 0.6,
      stagger: 0.03,
      ease: 'power2.out',
      delay: isOpen ? 0.5 : 0,
      overwrite: true
    })
    gsap.to(containerRef.current.querySelectorAll('.close-btn'), {
      autoAlpha: isOpen ? 1 : 0,
      duration: 0.6,
      ease: 'power2.out',
      delay: isOpen ? 0.8 : 0,
      overwrite: true
    })
  }, [isOpen])

  const onItemClick = useCallback((value) => {
    onToggleFilterId?.(value)
    if (closeOnSelected) onClose?.()
  }, [closeOnSelected, onClose, onToggleFilterId])

  return (
    <div
      className={cn(
        'md:hidden w-full h-full gradients-mobile-filters-container',
        className
      )}
      ref={useComposeRefs(bodyScrollRef, containerRef)}
    >
      <Mono
        as='button'
        className='absolute right-4 top-4 bg-white py-3 px-8 border border-solid text-sm close-btn'
        onClick={onClose}
      >
        Close
      </Mono>
      <ul className='flex flex-col items-center gap-2 overflow-auto overscroll-contain h-full py-40'>
        {filters.map(filter => (
          <li key={filter._id}>
            <MobileFilterTag
              id={filter._id}
              title={filter.title}
              onClick={onItemClick}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

function MobileFilterTag ({ id, title, onClick }) {
  return (
    <button
      data-filter-id={id}
      onClick={() => onClick(id)}
      className='bg-gray-300 items-center py-3 px-6 rounded-full hover:opacity-80'
    >
      <Heading as='h4'>{title}</Heading>
    </button>
  )
}

export default function MobileFiltersContainer ({ isOpen, ...props }) {
  return (
    <ClientOnlyPortal selector='#modal'>
      <MobileFilters
        className={cn('fixed top-0 left-0 z-modal translate-y-full')}
        isOpen={isOpen}
        {...props}
      />
    </ClientOnlyPortal>
  )
}
