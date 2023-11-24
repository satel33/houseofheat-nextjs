import cn from 'clsx'
import GradientHoverEffect from '../GradientHoverEffect'
import Link from '../Link'

const LinkItem = ({ className, children, ...props }) => {
  return (
    <li
      className={cn(
        '-mt-[1px] relative',
        'bottom-line top-line',
        'before:hidden first:before:block'
      )}
    >
      <Link
        className={cn('flex cursor-pointer py-3 group items-center')}
        showText={false}
        {...props}
      >
        <GradientHoverEffect offset='-30%' className='opacity-75' />
        <div className={cn('w-full relative', className)}>{children}</div>
      </Link>
    </li>
  )
}

export default LinkItem
