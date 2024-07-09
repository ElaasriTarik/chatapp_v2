import React from 'react';
import '../styles/Friends.css'
import moreIcon from '../icons/more.png';
import Message from '../icons/messages.png';

export default function MessageTag({ friend, displayMessages, handleMessage }) {

    return (
        <div className='message-req-tag' onClick={(e) => displayMessages(e, friend.friend_fullname)} key={friend.user_id} data-friend-id={friend.friend_id}>
            {/* <div className='friend-tag' > */}
            <div className='friendProfilePic'>
                <img src='https://via.placeholder.com/150' alt='profile pic' />
            </div>
            <div className='friendInfo' id={`user-${friend.friend_id}`}>
                <h3 className='friendName'>{
                    friend.friend_fullname
                }</h3>
            </div>
            <div className='friendActions'>
                <button className='messageBtn' onClick={handleMessage}><img src={Message} alt='message' /></button>
            </div>
        </div>
        // </div>
    )
}