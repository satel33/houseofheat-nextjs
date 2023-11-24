import cn from 'clsx'
import { useCallback } from 'react'

export default function MenuNavButton ({
  badgeCount = 0,
  id,
  isActive,
  disabled,
  onClick,
  icon,
  ...rest
}) {
  const onClickFn = useCallback(() => onClick(id), [onClick, id])

  return (
    <button
      {...rest}
      className={cn(
        'menu-nav-btn flex invisible items-center justify-center w-[38px] h-[38px] md:w-[47px] md:h-[47px] relative rounded-full border transition-colors duration-50 ease-linear',
        isActive ? 'border-black' : 'border-transparent',
        disabled && 'cursor-not-allowed',
        !disabled && 'hover:border-black group-hover:border-black'
      )}
      onClick={onClickFn}
    >
      {icon}
      {badgeCount > 0 && (
        <div className='bg-update text-white absolute flex items-center justify-center h-[22px] aspect-square rounded-full top-0 right-0 text-xs px-0.5'>
          {Math.min(99, badgeCount)}
        </div>
      )}
    </button>
  )
}
