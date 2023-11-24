import cn from 'clsx'
import Section from '../../Section'

export default function Placeholder ({ className, data = {} }) {
  const { url = '' } = data
  // TODO: Make this a better. Check what type of embed it is and change the padding to match roughly
  // For example, a youtube embed should have a 56.25%
  return (
    <Section
      className={cn(
        className,
        'bg-gray-300 animate-pulse',
        url.indexOf('youtube') >= 0 ? 'aspect-square' : 'aspect-video '
      )}
    />
  )
}
