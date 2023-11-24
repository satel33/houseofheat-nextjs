// NOTE: This is added once to the page
export function BrandFilter () {
  return (
    <svg viewBox='0 0 100 100' className="invisible fixed pointer-events-none">
      <filter id='colorMeLTA'>
        <feColorMatrix
          in='SourceGraphic'
          values='1 1 1 1 0
                1 1 1 1 0
                1 1 1 1 0
                0 0 0 1 0'
        />
      </filter>
    </svg>
  )
}

export default function BrandLogo ({ logoImage, className, light }) {
  if (!logoImage?.asset?.url) return null
  const url = logoImage?.asset?.url

  const aspect = logoImage?.asset?.metadata.dimensions.aspectRatio

  return (
    <svg viewBox={`0 0 ${100 * aspect} 100`} className={className}>
      <image
        x={0}
        y={0}
        width={100 * aspect}
        height={100}
        href={url}
        filter={light ? 'url(#colorMeLTA)' : null}
      />
    </svg>
  )
}
