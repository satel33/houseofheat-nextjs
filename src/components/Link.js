import NextLink from 'next/link'
import React, { forwardRef, useMemo } from 'react'

import { resolveLink } from '../helpers/resolvers'

const Link = forwardRef(
  (
    {
      openInNewTab = true,
      nonLinkTag = 'span',
      link,
      to,
      children,
      showText = true,
      scroll = false,
      prefetch = false,
      ...rest
    },
    ref
  ) => {
    const { url, text } = useMemo(() => {
      if (to) return { url: to }
      if (link) {
        return resolveLink(link)
      }
      return {}
    }, [link, to])

    // External Link
    if (
      url &&
      (url.indexOf('http') >= 0 ||
        url.indexOf('tel:') >= 0 ||
        url.indexOf('mailto:') >= 0)
    ) {
      return (
        // eslint-disable-next-line react/jsx-no-target-blank
        <a
          href={url}
          target={openInNewTab ? '_blank' : ''}
          rel={openInNewTab ? 'noreferrer noopener' : ''}
          {...rest}
          ref={ref}
        >
          {showText && text}
          {children}
        </a>
      )
    }

    // No Link
    if (!url) {
      const Tag = nonLinkTag
      return (
        <Tag {...rest} ref={ref}>
          {showText && text}
          {children}
        </Tag>
      )
    }

    // Internal Link
    return (
      <NextLink href={{ pathname: url }} scroll={scroll} prefetch={prefetch ? undefined : false}>
        <a {...rest} ref={ref}>
          {showText && text}
          {children}
        </a>
      </NextLink>
    )
  }
)

Link.displayName = 'Link'

export default Link
