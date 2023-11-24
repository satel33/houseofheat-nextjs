import cn from 'clsx'
import { useCallback, useState } from 'react'

import { isDesktop } from '../../helpers/screens'
import useOutsideClick from '../../hooks/useOutsideClick'
import CaretDownIcon from '../../icons/caret-down.svg'
import { hoverClassNames } from '../CallToAction'
import Mono from '../Typography/Mono'
import DesktopFilters from './DesktopFilters'
import MobileFilters from './MobileFilters'
import useKeyDown from '../../hooks/useKeyDown'

export default function Filters ({
  className,
  filters,
  selectedFilters = [],
  onToggleFilterId,
  gradientColorFrom,
  gradientColorTo,
  alternateColour,
  disabled = false,
  fromLeftSide = true,
  label = 'Brands'
}) {
  const [isOpen, toggleIsOpen] = useState(false)

  const filtersRef = useOutsideClick(
    useCallback(() => {
      if (isDesktop()) toggleIsOpen(false)
    }, []),
    isOpen
  )

  // close on esc key
  useKeyDown(() => toggleIsOpen(false))

  return (
    <div
      ref={filtersRef}
      className={cn(
        'relative rounded-full bg-white',
        className,
        !isOpen && hoverClassNames
      )}
    >
      <Mono
        as='button'
        data-filters-button
        disabled={disabled}
        className={cn(
          'border flex items-center gap-2 lg:gap-4 h-[1.75rem] px-3 rounded-full text-sm relative transition-color duration-300',
          'disabled:opacity-30 disabled:cursor-not-allowed',
          'before:absolute before:inset-0 before:rounded-full',
          'before:pointer-events-none before:opacity-0 before:transition-opacity before:duration-300',
          isOpen && 'before:opacity-100',
          'hover:!bg-lime-300 hover:!border-lime-300',
          alternateColour && 'hover:!bg-[#ffd976] hover:!border-[#ffd976]'
        )}
        onClick={() => toggleIsOpen(o => !o)}
      >
        <span className='relative'>{label}</span>
        <span
          className={cn(
            isOpen && '-mt-[0.125rem]',
            'transition-all ease-in-out duration-300 relative'
          )}
          style={{ transform: isOpen ? 'rotateX(-180deg)' : 'rotateX(0deg)' }}
        >
          <CaretDownIcon width={12} />
        </span>
      </Mono>
      <DesktopFilters
        isOpen={isOpen}
        className={cn(
          'hidden md:block',
          !fromLeftSide && 'left-auto right-0 justify-end'
        )}
        filters={filters}
        onToggleFilterId={onToggleFilterId}
        selectedFilters={selectedFilters}
        gradientColorFrom={gradientColorFrom}
        gradientColorTo={gradientColorTo}
      />
      <MobileFilters
        isOpen={isOpen}
        onClose={() => toggleIsOpen(false)}
        filters={filters}
        selectedFilters={selectedFilters}
        onToggleFilterId={onToggleFilterId}
        gradientColorFrom={gradientColorFrom}
        gradientColorTo={gradientColorTo}
      />
    </div>
  )
}
