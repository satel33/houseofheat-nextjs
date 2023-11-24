import Heading from '../../Typography/Heading'
import RichContent from '../../RichContent'

export default function EmptyResults ({ className, title, copy }) {
  return (
    <div className={className}>
      <Heading as='h3'>{title}</Heading>
      <RichContent content={copy} />
    </div>
  )
}
