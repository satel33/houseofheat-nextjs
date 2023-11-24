import React from 'react'

export function getValidChildren (children) {
  return React.Children.toArray(children).filter(child =>
    React.isValidElement(child)
  )
}

export function hasValidChildren (children) {
  return React.Children.count(getValidChildren(children)) > 0
}
