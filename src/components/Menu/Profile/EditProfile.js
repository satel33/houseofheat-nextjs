import cn from 'clsx'
import React, { useCallback, useState } from 'react'

import { useSession } from '../../../auth'
import CaretIcon from '../../../icons/caret.svg'
import Toggle from '../../Toggle'
import Mono from '../../Typography/Mono'

function EditProfile ({ onDoneEditing }) {
  const session = useSession()
  const user = session?.user

  return (
    <article className='flex-1 h-full flex flex-col gap-8 pt-10 px-4 pb-6 overflow-auto custom-scrollbar'>
      <aside>
        <button
          className='flex items-center gap-x-2 hover:opacity-50'
          onClick={onDoneEditing}
        >
          <CaretIcon
            height={10}
            style={{ transform: 'rotate(180deg)', marginBottom: 1 }}
          />
          <Mono>Back to profile</Mono>
        </button>
      </aside>
      {/* Sections here are defined by their title + list of settings (harcoded so far) */}
      <section>
        <p className='text-md pb-4 border-b border-b-neutral-100'>Profile</p>
        <ul>
          <SettingItem id='name' label='Name' value={user.displayName} />
        </ul>
      </section>
      <section>
        <p className='text-md pb-4 border-b border-b-neutral-100'>Location</p>
        <ul>
          <SettingItem
            id='location'
            label='Set My Location'
            value={user.location}
          />
        </ul>
      </section>
      <section>
        <p className='text-md pb-4 border-b border-b-neutral-100'>
          Notifications
        </p>
        <ul>
          <SettingItem
            id='desktopNotifications'
            label='Desktop Notifications'
            value={user.desktopNotifications}
            type='toggle'
          />
        </ul>
      </section>
      <section>
        <p className='text-md pb-4 border-b border-b-neutral-100'>
          Drop Alerts
        </p>
        <ul>
          <SettingItem
            id='alertReleaseDateAdded'
            label='Release Date Added'
            value={user.alertReleaseDateAdded}
            type='toggle'
          />
          <SettingItem
            id='alertDroppingInCountdown'
            label='Dropping in 24hrs (Countdown)'
            value={user.alertDroppingInCountdown}
            type='toggle'
          />
          <SettingItem
            id='alertRaffleOpen'
            label='Raffle Open'
            value={user.alertRaffleOpen}
            type='toggle'
          />
          <SettingItem
            id='alertNewBuyLinks'
            label='New Buy Links'
            value={user.alertNewBuyLinks}
            type='toggle'
          />
        </ul>
      </section>
    </article>
  )
}

function SettingItem ({
  id,
  label,
  className,
  value: initialValue,
  type = 'string'
}) {
  const [value, setValue] = useState(initialValue)
  // TODO: Implement the `onChange` / `onBlur` by directly calling a mutation here?
  const onChange = useCallback(e => {
    setValue(e.target.value)
  }, [])

  // Same thing here?
  const onToggle = useCallback(() => setValue(v => !v), [])

  return (
    <li
      className={cn(
        'flex items-center justify-between py-4 border-b border-b-neutral-100 text-[0.875rem]',
        className
      )}
    >
      <label className='cursor-pointer' htmlFor={id}>
        {label}
      </label>
      {type === 'toggle'
        ? (
          <Toggle id={id} value={value ?? false} onChange={onToggle} />
          )
        : (
          <input
            type='text'
            className='opacity-50 text-right outline-none'
            id={id}
            value={value ?? ''}
            onChange={onChange}
          />
          )}
    </li>
  )
}

export default EditProfile
