import cn from 'clsx'
import forEach from 'lodash/forEach'
import { forwardRef, useEffect, useRef } from 'react'
import { MonoSmall } from '../Typography/Mono'

const PRIMARY_COLORS = [
  '#414141',
  '#4c4d01',
  '#014d4d',
  '#002600',
  '#4d004e',
  '#4e0000',
  '#01004e'
]

const SECONDARY_COLORS = [
  '#01004e',
  '#000000',
  '#4d004e',
  '#000000',
  '#014d4d',
  '#000000',
  '#4d4d4d'
]

const Loading = forwardRef(({ percent }, ref) => {
  const loaded = percent >= 100
  const progressRef = useRef()
  useEffect(() => {
    if (loaded) return
    let count = 0
    const timerId = window.setInterval(() => {
      count += 1
      forEach(PRIMARY_COLORS, (color, index) => {
        const newIndex = (count + index) % 7
        progressRef.current.children[newIndex + 2].style.backgroundColor = color
      })
    }, 150)
    let count2 = 0
    const timerId2 = window.setInterval(() => {
      count2 += 1
      forEach(SECONDARY_COLORS, (color, index) => {
        const newIndex = 6 - ((count2 + index) % 7)
        progressRef.current.children[newIndex + 9].style.backgroundColor = color
      })
    }, 100)
    return () => {
      window.clearInterval(timerId)
      window.clearInterval(timerId2)
    }
  }, [loaded])

  return (
    <div
      className={cn('absolute inset-0 flex justify-center items-center z-10', loaded && 'pointer-events-none')}
      ref={ref}
    >
      <div className='w-1/2 bg-red aspect-[2/1.4] grid grid-cols-7 relative' style={{ gridTemplateRows: '90% 10%' }} ref={progressRef}>
        <MonoSmall className='absolute left-1/2 top-1/4 -translate-x-1/2'>Rating System</MonoSmall>
        <MonoSmall className='absolute left-1/2 bottom-1/4 -translate-x-1/2'>Loading</MonoSmall>
        {PRIMARY_COLORS.map((c, i) => <div key={i} style={{ backgroundColor: c }} />)}
        {SECONDARY_COLORS.map((c, i) => <div key={i} style={{ backgroundColor: c }} />)}
      </div>
    </div>
  )
})

export default Loading
