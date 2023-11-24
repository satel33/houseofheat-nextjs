import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

const PanelsContainer = ({ children, index }) => {
  const ref = useRef()
  useEffect(() => {
    if (ref.current) {
      gsap.to(ref.current.children, { x: `-${index * 100}%`, ease: 'expo.inOut', duration: 0.5 })
    }
  }, [index])

  return (
    <div className='w-full h-full relative overflow-hidden' ref={ref}>
      {React.Children.map(children, (child, i) => (
        <div key={i} className='absolute top-0 bottom-0 w-full overflow-auto overscroll-contain' style={{ left: `${i * 100}%` }}>
          {child}
        </div>
      ))}
    </div>
  )
}

export default PanelsContainer
