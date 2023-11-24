import { useEffect, useState } from 'react'

export default function ClientOnly ({ children, placeholder, ...props }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    if (!placeholder) return null
    const Placeholder = placeholder
    return <Placeholder {...props}>{children}</Placeholder>
  }

  return <>{children}</>
}
