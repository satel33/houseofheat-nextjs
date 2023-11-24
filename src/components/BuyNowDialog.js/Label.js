import cn from 'clsx'
import { MonoTag } from '../Typography/Mono'

const Label = ({ className, children }) => {
  return (
    <MonoTag
      className={cn(
        'ml-4 my-2 relative after:absolute after:rounded after:w-2 after:h-2 after:-left-4 after:top-1/2 after:-translate-y-1/2 after:bg-current flex items-center',
        className
      )}
    >
      {children}
    </MonoTag>
  )
}

export default Label
