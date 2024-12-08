import React from 'react'
import AddButton from './AddImage'
import Profile from './Profile'
import ProfileFeed from './ProfileFeed'

const page = () => {
  return (
    <div className='flex flex-col'>
        <Profile />
        <AddButton />
        <ProfileFeed />
    </div>
  )
}

export default page