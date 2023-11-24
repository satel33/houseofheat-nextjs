import { useEffect, useRef, useMemo } from 'react'
import debounce from 'lodash/debounce'
import {
  Bodies,
  Body,
  Composite,
  Engine,
  Mouse,
  MouseConstraint,
  Render,
  Runner
} from 'matter-js'
import screens from '../../../theme/screens.cjs'

// Make the walls thicker (so that the balls can't go through even with velocity?)
const WALL_WIDTH = 50

export default function Canvas ({ numberOfItems, images }) {
  // Keep a few references
  const sceneRef = useRef()
  const engineRef = useRef(Engine.create())

  const sprites = useMemo(() => {
    return images.map(image => ({
      texture: image.asset.url,
      width: image.asset.metadata.dimensions.width,
      height: image.asset.metadata.dimensions.height
    }))
  }, [images])

  // On mount, create the scene
  useEffect(() => {
    const scene = sceneRef.current
    const engine = engineRef.current
    const w = scene.offsetWidth
    const h = scene.offsetHeight

    // Create a renderer
    const render = Render.create({
      element: scene,
      engine,
      options: {
        width: w,
        height: h,
        wireframes: false,
        background: 'transparent'
      }
    })

    // Run the renderer
    Render.run(render)

    // Create & run the runner
    const runner = Runner.create()
    Runner.run(runner, engine)

    // Create the scene walls
    function createBoundaries (width, height) {
      const opts = { isStatic: true, render: { fillStyle: '#fff' } } // Make them white!
      const x = width / 2
      const y = height / 2
      const offset = WALL_WIDTH / 2

      const b = Bodies.rectangle(x, height + offset, width, WALL_WIDTH, opts)
      const t = Bodies.rectangle(x, -offset, width, WALL_WIDTH, opts)
      const l = Bodies.rectangle(-offset, y, WALL_WIDTH, height, opts)
      const r = Bodies.rectangle(width + offset, y, WALL_WIDTH, height, opts)
      return [b, t, l, r]
    }
    let walls = createBoundaries(w, h)
    Composite.add(engine.world, walls)

    // Create elements
    // TODO: Maybe use `Composites.stack` to optimise this? https://github.com/liabru/matter-js/blob/master/examples/mixed.js
    const itemCount = window.innerWidth < parseInt(screens.md) ? numberOfItems / 2 : numberOfItems
    for (let index = 0; index < itemCount; index++) {
      // Get a random asset from the constants
      const spriteIdx = Math.floor(Math.random() * sprites.length)
      const asset = sprites[spriteIdx]

      // Create the object (we could probably optimise this by having random values here)
      const x = Math.floor(Math.random() * w)
      const y = Math.floor(Math.random() * h)
      const body = Bodies.rectangle(x, y, asset.width, asset.height, {
        density: 0.0005,
        frictionAir: 0.06,
        restitution: 0.3,
        friction: 0.01,
        render: { sprite: { texture: asset.texture } }
      })
      const randomAngle = Math.floor((Math.random() * 90) - 45)
      Body.rotate(body, randomAngle)
      Composite.add(engine.world, body)
    }

    // Add mouse controls
    const mouse = Mouse.create(render.canvas)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    })
    Composite.add(engine.world, mouseConstraint)

    // Keep the mouse in sync with rendering
    render.mouse = mouse

    // Resize listener
    const onResize = debounce(() => {
      const newW = scene.offsetWidth
      const newH = scene.offsetHeight

      // Reset the boundaries
      walls.map(w => Composite.remove(engine.world, w))
      walls = createBoundaries(newW, newH)
      Composite.add(engine.world, walls)

      // Reset canvas dimensions
      render.bounds.max.x = newW
      render.bounds.max.y = newH
      render.options.width = newW
      render.options.height = newH
      render.canvas.width = newW
      render.canvas.height = newH
    }, 200)
    window.addEventListener('resize', onResize, { passive: true })

    // Cleaning
    return () => {
      window.removeEventListener('resize', onResize)
      Render.stop(render)
      Runner.stop(runner)
      render.canvas.remove()
      render.canvas = null
      render.context = null
      render.textures = {}
    }
  }, [numberOfItems])

  return <div ref={sceneRef} className='w-full h-full' />
}
