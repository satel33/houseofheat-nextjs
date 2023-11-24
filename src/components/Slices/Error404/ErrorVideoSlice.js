import Mono, { MonoTag } from '../../Typography/Mono'
import Ticker from '../../Ticker'
import Button from '../../Button'
import Link from '../../Link'

export default function ErrorVideo ({ data }) {
  const { video, code, message } = data
  return (
    <section className='fixed h-full w-full overflow-hidden z-[9999] bg-[#DBFE43] flex items-center justify-center'>
      <Mono className='hidden md:block absolute top-6 left-6 text-white mix-blend-difference'>{code} error</Mono>
      <Mono className='hidden md:block absolute bottom-6 left-6 text-white mix-blend-difference'>{code} error</Mono>
      <Mono className='hidden md:block absolute top-6 right-6 text-white mix-blend-difference'>{message}</Mono>
      <Mono className='hidden md:block absolute bottom-6 right-6 text-white mix-blend-difference'>{message}</Mono>

      <div className='relative overflow-hidden w-full h-full md:h-[90vh] md:w-[60.6vh]'>
        <Ticker pxPerSecond={100} className='select-none absolute top-0 text-white mix-blend-difference'>
          <MonoTag as='span' className='mx-2 my-2 whitespace-nowrap'>
            <span className='inline-block mr-4'>{code}</span><span>{message}</span>
          </MonoTag>
        </Ticker>

        <svg className='z-[10000] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] mix-blend-difference' width='92' height='75' viewBox='0 0 92 75' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path d='M15.5432 74.9932V45.2461H45.0678V74.9932H60.027V4.88227H45.0678V32.6262H15.5432V4.88227H0.583984V74.9932H15.5432Z' fill='white'/>
          <path d='M79.0397 25.6598C86.3899 25.6598 91.4635 20.4355 91.4635 13.3596C91.4635 6.41586 86.3249 0.993164 79.1048 0.993164C71.8847 0.993164 66.7461 6.41586 66.7461 13.3596C66.7461 20.2371 71.6896 25.6598 79.0397 25.6598ZM79.1048 18.7161C76.3078 18.7161 74.1613 16.5999 74.1613 13.2934C74.1613 10.1853 76.3078 8.06912 79.1048 8.06912C81.9668 8.06912 83.9832 10.1853 83.9832 13.2934C83.9832 16.5338 81.9668 18.7161 79.1048 18.7161Z' fill='white'/>
        </svg>

        <video src={video?.asset?.url} autoPlay="autoplay" loop={true} muted={true} playsInline className='w-full h-full object-cover md:w-auto md:h-[90vh]'/>

        <Button as={Link} to='/' withBorder className='whitespace-nowrap absolute bottom-16 left-[50%] translate-x-[-50%] border-white text-white px-16 py-6 justify-center pointer-events-auto mix-blend-difference hover:bg-white hover:text-black'>
          <Mono>Back To Home</Mono>
        </Button>

        <Ticker pxPerSecond={100} className='select-none absolute bottom-0 text-white mix-blend-difference'>
          <MonoTag as='span' className='mx-2 my-2 whitespace-nowrap'>
            <span className='inline-block mr-4'>{code}</span><span>{message}</span>
          </MonoTag>
        </Ticker>
      </div>
    </section>
  )
}
