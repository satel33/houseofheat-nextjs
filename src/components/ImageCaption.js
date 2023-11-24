import cn from 'clsx'
import { MonoSmall } from './Typography/Mono.js'

const ImageCaption = ({ image, className }) => {
  if (!image?.caption) return null
  return (
    <MonoSmall className={cn(className, 'mt-2 flex')}>
      <span className='inline-block mr-6 opacity-50'>“Note”</span>
      {image.caption}
    </MonoSmall>
  )
}

export default ImageCaption
