import Email from './Email'
import Facebook from './Facebook'
import Instagram from './Instagram'
import Snapchat from './Snapchat'
import Twitter from './Twitter'
import Whatsapp from './Whatsapp'

export default function SocialIcon ({ type, ...props }) {
  switch (type) {
    case 'email':
      return <Email {...props} />
    case 'facebook':
      return <Facebook {...props} />
    case 'instagram':
      return <Instagram {...props} />
    case 'snapchat':
      return <Snapchat {...props} />
    case 'twitter':
      return <Twitter {...props} />
    case 'whatsapp':
      return <Whatsapp {...props} />
    default:
      return null
  }
}
