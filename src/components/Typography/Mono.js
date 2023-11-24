import cn from 'clsx'
import React from 'react'

export const monoClassName = 'font-mono uppercase leading-[1.2]'

export default function Mono ({
  as: Component = 'span',
  size,
  className,
  wrap = true,
  children,
  ...props
}) {
  const classes = cn(
    className,
    monoClassName,
    size || 'text-sm'
  )
  if (!wrap) {
    return React.Children.map(children, child =>
      React.cloneElement(child, {
        ...child.props,
        className: cn(classes, child.props.className)
      })
    )
  }
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  )
}

export function MonoTag (props) {
  return <Mono size='text-xs' {...props} />
}

export function MonoSmall (props) {
  return <Mono size='text-xxs' {...props} />
}
