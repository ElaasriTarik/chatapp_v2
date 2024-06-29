import React from 'react';
import '../styles/Friends.css'

export default function FriendDisplay() {
    return (
        <div className='friend-req-tag'>
            <div className='friendProfilePic'>
                <img src='https://via.placeholder.com/150' alt='profile pic' />
            </div>
            <div className='friendInfo'>
                <h3 className='friendName'>John Doe</h3>
                <div className='friendActions'>
                    <button className='inviteBtn'>Invite</button>
                    <button className='removeBtn'>Remove</button>
                </div>
            </div>
        </div>
    )
}