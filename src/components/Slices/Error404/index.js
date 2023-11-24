import dynamic from 'next/dynamic'

import Mono, { MonoTag } from '../../Typography/Mono'
import Ticker from '../../Ticker'
import Button from '../../Button'
import Link from '../../Link'

const Canvas = dynamic(() => import('./Canvas'), {
  loading: () => <div className='w-full h-full' />
})

export default function Error404 ({ data }) {
  const { numberOfItems, images, code, message } = data
  return (
    <section className='h-screen w-full relative overflow-hidden'>
      <div className='absolute inset-0 flex justify-center items-center pointer-events-none'>
        <Button as={Link} to='/' withBorder className='px-16 py-6 justify-center pointer-events-auto'>
          <Mono>Back To Home</Mono>
        </Button>
      </div>
      <Canvas numberOfItems={numberOfItems} images={images} />
      <footer className='absolute bottom-0 w-full border-t overflow-hidden pointer-events-none'>
        <Ticker pxPerSecond={100} className='select-none'>
          <MonoTag as='span' className='mx-2 my-2 whitespace-nowrap'>
            <span className='inline-block mr-4'>{code}</span><span>{message}</span>
          </MonoTag>
        </Ticker>
      </footer>
    </section>
  )
}
