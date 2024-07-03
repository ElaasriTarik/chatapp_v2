import React from 'react';
import '../styles/Friends.css'

export default function FriendDisplay({ name, userId, handleInvite }) {

    return (
        <div className='friend-req-tag'>
            <div className='friendProfilePic'>
                <img src='https://via.placeholder.com/150' alt='profile pic' />
            </div>
            <div className='friendInfo' id={`user-${userId}`}>
                <h3 className='friendName'>{name}</h3>
                <div className='friendActions'>
                    <button className='inviteBtn' onClick={(e) => handleInvite(e, name)}>Invite</button>
                    <button className='removeBtn'>Remove</button>
                </div>
            </div>
        </div>
    )
}