import cn from 'clsx'
import Advertisement from '../../Advertisement'

import { gridClasses } from '../../Section'
import ReleaseTile from './ReleaseTile'

export default function ReleasesGrid ({ releases }) {
  const classes = cn('col-span-full md:col-span-4 xl:col-span-3')
  return (
    <div className={cn('col-span-full', gridClasses)}>
      {releases.map((release, i) => {
        return (
          <>
            <ReleaseTile
              key={release._id}
              className={classes}
              release={release}
            />
            {i > 0 && i < (releases.length - 1) && i % 6 === 0 && (
              <Advertisement size='tile' className={cn(classes, 'flex justify-center items-center')} bottomMargin={false} />
            )}
          </>
        )
      })}
    </div>
  )
}
