import React from 'react'
import AddButton from './AddImage'
import Profile from './Profile'
import ProfileFeed from './ProfileFeed'

const page = () => {
  return (
    <div className='flex flex-col'>
        <AddButton />
        <Profile />
        <ProfileFeed />
    </div>
  )
}

export default page