import cn from 'clsx'
import gsap from 'gsap'
import { useEffect } from 'react'

import Mono from '../Typography/Mono'
import useGradient from './useGradient'

export default function DesktopFilters ({
  isOpen,
  className,
  filters,
  onToggleFilterId,
  selectedFilters,
  gradientColorFrom,
  gradientColorTo
}) {
  const filtered = selectedFilters && selectedFilters.length > 0

  // Use a "global" gradient for the filters that are selected (or all of them if no filtering)
  const tagsWithGradient = filtered ? selectedFilters : filters.map(f => f._id)
  const containerRef = useGradient(
    isOpen,
    tagsWithGradient,
    gradientColorFrom,
    gradientColorTo
  )

  useEffect(() => {
    gsap.set(containerRef.current, { opacity: 1 })
    gsap.to(containerRef.current.children, {
      y: isOpen ? 0 : 5,
      autoAlpha: isOpen ? 1 : 0,
      duration: 0.4,
      stagger: isOpen ? 0.01 : -0.01,
      ease: isOpen ? 'power2.inOut' : 'expo.out',
      overwrite: true
    })
  }, [isOpen])

  return (
    <div
      className={cn(
        'hidden absolute left-0 z-10 top-[1.75rem] w-72 mt-[0.4375rem] md:flex flex-wrap gap-1 opacity-0',
        !isOpen ? 'pointer-events-none' : '',
        className
      )}
      ref={containerRef}
    >
      {filters.map(filter => (
        <DesktopFilterTag
          key={filter._id}
          id={filter._id}
          title={filter.title}
          onClick={onToggleFilterId}
        />
      ))}
    </div>
  )
}

function DesktopFilterTag ({ id, title, onClick }) {
  return (
    <Mono
      as='button'
      data-filter-id={id}
      onClick={() => onClick(id)}
      className='bg-gray-300 items-center py-2 px-3 rounded-full opacity-0 translate-y-[10px] group'
    >
      <span className='group-hover:opacity-80 transition-opacity ease-in-out'>
        {title}
      </span>
    </Mono>
  )
}
