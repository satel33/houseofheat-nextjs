import cn from 'clsx'
import gsap from 'gsap'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useToggle } from 'react-use'

import { useAtomValue } from 'jotai'
import random from 'lodash/random'
import { stringify } from 'querystring'
import CaretDownIcon from '../../../icons/caret-down.svg'
import { settingsAtom } from '../../../store/content'
import AnimatedGradient from '../../AnimatedGradient'
import Button from '../../Button'
import Link from '../../Link'
import Mono from '../../Typography/Mono'

import { getTextFromLink } from '../../../helpers/resolvers'
import useHover from '../../../hooks/useHover'
import gradients from '../../../theme/gradients.cjs'

export const useRandomGradient = () => {
  const [index, setIndex] = useState(0)

  // Randomly assign a new gradient
  const createGradient = useCallback(() => {
    setIndex(random(gradients.length - 1))
  }, [])

  return { createGradient, gradient: gradients[index] }
}

export default function MainNavigation ({ onClose }) {
  const { menu, newsletterSettings } = useAtomValue(settingsAtom)

  // Construct the mailto email address
  const { email, ...params } = newsletterSettings
  const href = `mailto:${email}?${stringify(params)}`

  return (
    <div className='flex-1 h-full flex flex-col gap-8 md:gap-16 justify-between pb-16 mx-6 md:mx-14'>
      <ul className='flex flex-1 flex-col items-center gap-2 pt-10 md:pt-16'>
        {menu.links.map(({ _id, ...link }) => (
          <NavigationItem key={_id} link={link} onClose={onClose} className='menu-fade-up'/>
        ))}
        <NavigationDropdown title='Brands' className='menu-fade-up'>
          {menu.brands.map(({ _id, ...link }) => (
            <NavigationItem key={_id} link={link} onClose={onClose}/>
          ))}
        </NavigationDropdown>
      </ul>
      <Button
        className='w-full justify-center py-4 text-sm md:text-xs menu-fade-up'
        withBorder
        href={href}
        target='_blank'
        as='a'
      >
        Get Heat to your inbox
      </Button>
      {(menu.about.length > 0 || menu.socials.length > 0) && (
        <div className='w-full mx-auto pt-3 grid grid-cols-2 gap-10'>
          <div className='flex-grow menu-fade-up'>
            <Mono as='p' className='mb-4 opacity-50'>
              Follow
            </Mono>
            <ul>
              {menu.socials.map(link => (
                <li key={link._key} className='leading-tight'>
                  <Link
                    className='text-sm hover:opacity-50'
                    to={link.url}
                    showText={false}
                  >
                    <span className='capitalize'>{link.type}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className='flex-grow menu-fade-up'>
            <Mono as='p' className='mb-4 opacity-50'>
              About
            </Mono>
            <ul>
              {menu.about.map(link => (
                <li key={link._key} className='leading-tight'>
                  <Link className='text-sm hover:opacity-50' link={link} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {(menu.copyrightLeft || menu.copyrightRight) &&
        <div className='w-full mx-auto grid grid-cols-2 gap-10 -mt-4 menu-fade-up'>
          {menu.copyrightLeft && <div className='flex-grow'>
            <Mono as='p' className='text-[0.5rem] opacity-50'>{menu.copyrightLeft.replace('{YEAR}', new Date().getFullYear())}</Mono>
          </div>}
          {menu.copyrightRight && <div className='flex-grow'>
            <Mono as='p' className='text-[0.5rem] opacity-50'>{menu.copyrightRight}</Mono>
          </div>}
        </div>
      }
    </div>
  )
}

const NavigationDropdown = ({ children, title, className }) => {
  const listRef = useRef()
  const [isDropdownOpen, toggleDropdownOpen] = useToggle(false)
  const { gradient, createGradient } = useRandomGradient()
  const [hoverRef, hover] = useHover()
  useEffect(() => {
    createGradient()
  }, [hover])

  // Animate the dropdown
  useEffect(() => {
    gsap.to(listRef.current, {
      autoAlpha: isDropdownOpen ? 1 : 0,
      height: isDropdownOpen ? 'auto' : 0,
      ease: 'power2.inOut',
      transformOrigin: 'center top',
      duration: 0.6
    })
  }, [isDropdownOpen])

  return (
    <li className={cn('overflow-y-hidden', className)}>
      <button
        className={cn('menu-nav-item mx-auto flex items-center gap-x-3 px-6 text-[48px] tracking-[-0.05em] leading-[1.3] font-serif text-center rounded-full relative overflow-hidden group isolate')}
        onClick={toggleDropdownOpen}
        ref={hoverRef}
      >
        <span>{title}</span>
        <CaretDownIcon
          width={18}
          className={cn(
            'transition-transform duration-300 ease-out'
            // isDropdownOpen && 'rotate-180'
          )}
          style={{ transform: `rotateX(${isDropdownOpen ? '-180deg' : '0deg'})` }}
        />
        <div className='absolute overflow-hidden w-full h-full top-0 left-0 -z-1 rounded-full md:scale-[0.8] md:group-hover:scale-100 transition-transform duration-300 ease-custom-out' style={{ transform: 'translateZ(-10px)' }}>
          {hover && (
            <AnimatedGradient
              gradient={gradient}
              duration={5}
              animate
              className='invisible group-hover:visible'
            />
          )}
        </div>
      </button>
      <ul
        ref={listRef}
        className='flex flex-col mt-2 mx-2 items-center gap-2 invisible h-0'
      >
        {children}
      </ul>
    </li>
  )
}

const NavigationItem = ({ link, onClose, className }) => {
  const { gradient, createGradient } = useRandomGradient()
  const [hoverRef, hover] = useHover()
  useEffect(() => {
    createGradient()
  }, [hover])

  return (
    <li className={cn('overflow-y-hidden', className)}>
      <Link
        className={cn(
          'menu-nav-item block px-6 text-[48px] tracking-[-0.05em] leading-[1.3] font-serif text-center',
          'rounded-full relative overflow-hidden group whitespace-nowrap isolate'
        )}
        ref={hoverRef}
        link={link}
        onClick={onClose}
        showText={false}
      >
        {getTextFromLink(link)}
        <div className='absolute overflow-hidden w-full h-full top-0 left-0 -z-1 rounded-full md:scale-[0.8] md:group-hover:scale-100 transition-transform duration-300 ease-custom-out'>
          {hover && (
            <AnimatedGradient
              gradient={gradient}
              duration={5}
              className='invisible group-hover:visible'
            />
          )}
        </div>
      </Link>
    </li>
  )
}
