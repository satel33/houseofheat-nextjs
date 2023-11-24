import { useEffect, useState } from 'react'

import {
  getEmailShareURL,
  getFacebookShareURL,
  getTwitterShareURL,
  getWhatsappShareURL
} from '../helpers/share'
import Email from './SocialIcon/Email'
import Facebook from './SocialIcon/Facebook'
import Twitter from './SocialIcon/Twitter'
import Whatsapp from './SocialIcon/Whatsapp'

export default function ShareInline () {
  const [pageURL, setPageURL] = useState()

  useEffect(() => {
    setPageURL(window.location.href)
  }, [])

  return (
    <div className='flex items-center md:mt-3 col-span-3'>
      <a
        href={getFacebookShareURL(pageURL)}
        className='mr-6 hover:opacity-50 transition-opacity'
        target='_blank'
        rel='noopener noreferrer nofollow'
      >
        <Facebook height={16} />
      </a>
      <a
        href={getTwitterShareURL(pageURL)}
        className='mr-6 hover:opacity-50 transition-opacity'
        target='_blank'
        rel='noopener noreferrer nofollow'
      >
        <Twitter height={16} />
      </a>
      <a
        href={getWhatsappShareURL(pageURL)}
        className='mr-6 hover:opacity-50 transition-opacity'
        target='_blank'
        rel='noopener noreferrer nofollow'
      >
        <Whatsapp height={16} />
      </a>
      <a
        href={getEmailShareURL(pageURL)}
        className='mr-6 hover:opacity-50 transition-opacity'
      >
        <Email height={12} />
      </a>
      <button
        className='mr-6 hover:opacity-50 transition-opacity'
        onClick={() => navigator.clipboard.writeText(pageURL)}
      >
        <svg
          width='16'
          height='16'
          viewBox='0 0 16 16'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M9.26858 6.84173C8.65425 6.22765 7.82119 5.88269 6.95258 5.88269C6.08396 5.88269 5.25091 6.22765 4.63658 6.84173L2.31983 9.15773C1.70548 9.77207 1.36035 10.6053 1.36035 11.4741C1.36035 12.3429 1.70548 13.1761 2.31983 13.7905C2.93417 14.4048 3.76739 14.75 4.6362 14.75C5.50501 14.75 6.33823 14.4048 6.95258 13.7905L8.11058 12.6325'
            stroke='currentColor'
            strokeWidth='1.58333'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M6.9541 9.1581C7.56843 9.77218 8.40149 10.1171 9.2701 10.1171C10.1387 10.1171 10.9718 9.77218 11.5861 9.1581L13.9029 6.8421C14.5172 6.22776 14.8623 5.39454 14.8623 4.52573C14.8623 3.65692 14.5172 2.82369 13.9029 2.20935C13.2885 1.59501 12.4553 1.24988 11.5865 1.24988C10.7177 1.24988 9.88444 1.59501 9.2701 2.20935L8.1121 3.36735'
            stroke='currentColor'
            strokeWidth='1.58333'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>
    </div>
  )
}
