import { useEffect, useState } from 'react'

import {
  getEmailShareURL,
  getFacebookShareURL,
  getTwitterShareURL,
  getWhatsappShareURL
} from '../../helpers/share'
import DropDown from '../DropDown'

function ShareLinks () {
  const [pageURL, setPageURL] = useState()

  useEffect(() => {
    setPageURL(window.location.href)
  }, [])

  const className =
    'block bg-white hover:bg-black text-black hover:text-white px-3 py-2 text-xs font-mono uppercase'
  const p = { className, target: '_blank', rel: 'noreferrer noopener' }

  const links = [
    <a key='facebook' href={getFacebookShareURL(pageURL)} {...p}>
      Facebook
    </a>,
    <a key='twitter' href={getTwitterShareURL(pageURL)} {...p}>
      Twitter
    </a>,
    <a key='whatsapp' href={getWhatsappShareURL(pageURL)} {...p}>
      Whatsapp
    </a>,
    <a key='email' href={getEmailShareURL(pageURL)} {...p}>
      Email
    </a>
  ]

  return links
}

export default function ShareAction ({ className, classNames }) {
  return (
    <DropDown
      label='Share'
      buttonText='Share'
      className={className}
      classNames={classNames || { label: 'opacity-0', buttonText: 'text-xs' }}
    >
      <ShareLinks />
    </DropDown>
  )
}
