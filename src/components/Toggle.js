import cn from 'clsx'
import { hoverClassNames } from './CallToAction'

import Mono from './Typography/Mono'

export default function Toggle ({
  labelOff,
  labelOn,
  value,
  onChange,
  className,
  hideMobileLabelOff = true,
  id
}) {
  return (
    <div className={cn('flex items-center gap-2 lg:gap-4', className)}>
      {labelOff && (
        <Mono
          as='label'
          htmlFor={`${id}`}
          className={cn(
            value && 'opacity-50',
            hideMobileLabelOff && 'hidden md:inline-block',
            'transition-opacity hover:cursor-pointer hover:opacity-60'
          )}
        >
          {labelOff}
        </Mono>
      )}
      <div className={cn('relative flex', hoverClassNames)}>
        <input
          type='checkbox'
          id={id}
          checked={value}
          onChange={onChange}
          className={cn(
            'appearance-none border border-black w-[58px] h-[28px] rounded-full relative hover:cursor-pointer shrink-0 bg-white',
            'after:block after:w-[20px] after:h-[20px] after:border after:rounded-full after:absolute after:left-0 after:top-1/2 after:translate-x-[4px] after:-translate-y-1/2 after:transition-all after:duration-300 after:ease-out',
            'checked:after:translate-x-[32px] checked:after:bg-gradient-to-bl checked:after:from-lime-300 checked:after:to-cyan-400',
            'hover:after:bg-gradient-to-bl hover:after:from-lime-300 hover:after:to-cyan-400'
          )}
        />
      </div>
      {labelOn && (
        <Mono
          as='label'
          htmlFor={`${id}`}
          className={cn(
            !value && 'opacity-50',
            'transition-opacity hover:cursor-pointer hover:opacity-70'
          )}
        >
          {labelOn}
        </Mono>
      )}
    </div>
  )
}
