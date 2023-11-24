import cn from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'

import CaretDownIcon from '../icons/caret-down.svg'
import Button from './Button'

import gsap from 'gsap'
import useOutsideClick from '../hooks/useOutsideClick'
import useWindowResize from '../hooks/useWindowResize'
import screens from '../theme/screens.cjs'
import Mono from './Typography/Mono'

export default function DropDown ({
  className,
  classNames = {},
  containerClassName,
  label,
  buttonText,
  children,
  expandOnDesktop = false,
  showCaret = true,
  fill = true,
  withBorder = true,
  withHover = true,
  disabled
}) {
  const dropDownRef = useRef()
  const [open, setOpen] = useState(false)
  const toggleOpen = useCallback(e => {
    setOpen(o => !o)
    e.stopPropagation()
    e.preventDefault()
  }, [])

  const containerRef = useOutsideClick(
    useCallback(() => {
      setOpen(false)
    }, []),
    open
  )

  useWindowResize(
    useCallback(() => {
      if (!expandOnDesktop || window.innerWidth >= parseInt(screens.md)) {
        gsap.set(dropDownRef.current, { clearProps: 'height' })
      }
    }, [expandOnDesktop]),
    true,
    true
  )

  useEffect(() => {
    if (expandOnDesktop && window.innerWidth >= parseInt(screens.md)) {
      gsap.set(dropDownRef.current, { clearProps: 'height' })
    } else {
      const tl = gsap.timeline()
      tl.to(dropDownRef.current, {
        height: open ? 'auto' : 0,
        duration: 0.25,
        ease: 'power2.inOut'
      })
    }
  }, [expandOnDesktop, open])

  return (
    <div className={cn('flex flex-col justify-between', className)}>
      {label && (
        <Mono className={classNames.label} as='p'>
          {label}
        </Mono>
      )}
      <div ref={containerRef} className='relative'>
        <Button
          className={cn(
            'h-8 px-3 gap-2 flex justify-between items-center z-10 w-full relative overflow-hidden',
            !open && (fill || 'bg-white'),
            fill && withHover && 'hover:!bg-black',
            expandOnDesktop && 'md:hidden',
            classNames.button,
            open && withHover && '!bg-black !text-white !border-black'
          )}
          onClick={toggleOpen}
          withHover={withHover}
          withBorder={withBorder}
          disabled={disabled}
        >
          <span className={cn('font-mono uppercase text-sm', classNames.buttonText)}>{buttonText}</span>
          {showCaret && (
            <CaretDownIcon
              width={10}
              className={cn('transition-transform duration-150 flex-shrink-0')}
              style={{ transform: open ? 'rotateX(-180deg)' : 'rotateX(0deg)' }}
            />
          )}
        </Button>
        <div
          className={cn(
            'gap-2 w-full h-0 absolute overflow-hidden bg-white z-1 after:absolute',
            'before:h-[1px] before:left-0 before:right-0 before:top-0 before:bg-black',
            'after:h-[1px] after:left-0 after:right-0 after:bottom-0 after:bg-black',
            expandOnDesktop &&
              'md:w-auto md:h-auto md:static md:mt-0 md:before:hidden md:after:hidden',
            !expandOnDesktop && 'opacity-100',
            classNames.dropDown
          )}
          ref={dropDownRef}
        >
          <div
            className={cn(
              'w-full border-[1px] border-black border-solid border-b-0 border-t-0',
              containerClassName,
              withHover && 'pt-[1px]',
              expandOnDesktop && 'md:flex md:border-none'
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
