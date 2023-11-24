import cn from 'clsx'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import { useMemo } from 'react'
import Link from '../../Link'

const Item = ({ value, link, index }) => {
  return <>
    {index > 0 && ', '}
    <Link link={link} showText={false} className={link && 'hover:underline'}>{value}</Link>
  </>
}

export function FieldSet ({ className, labelClassName, label, value, link }) {
  const items = useMemo(() => isArray(value)
    ? value.map((v, i) => ({ value: v, link: link?.[i] }))
    : [{ value, link }]
  , [value, link])
  if (isEmpty(value)) return null

  return (
    <div className={cn(className, 'flex')}>
      <p
        className={cn(
          labelClassName,
          'opacity-50 w-1/2 max-w-[10rem] flex-shrink-0 flex-grow-0'
        )}
      >
        {label}
      </p>
      <p className='mb-2 w-40'>
        {items.map(({ value, link }, index) => <Item key={value} index={index} value={value} link={link} />)}
      </p>
    </div>
  )
}
