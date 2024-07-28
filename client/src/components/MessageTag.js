import React from 'react';
import '../styles/Friends.css';
import Message from '../icons/messages.png';


export default function MessageTag({ friend, displayMessages, handleMessage }) {

  // Helper function to truncate a text
  function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }

  return (
    <div className='message-req-tag' onClick={(e) => displayMessages(e, friend.friend_fullname)} data-friend-id={friend.friend_id}>
      {/* <div className='friend-tag' > */}
      <div className='friendProfilePic'>
        <img src={friend.profilePic_link} alt='profile pic' />
      </div>
      <div className='friendInfo' id={`user-${friend.friend_id}`}>
        <h3 className='friendName'>{
          friend.friend_fullname
        }</h3>
        <p className='init-chat-label'>{truncateText(friend.last_message, 40)}</p>
      </div>
      <div className='friendActions'>
        <button className='messageBtn' onClick={handleMessage}><img src={Message} alt='message' /></button>
      </div>
    </div>
    // </div>
  )
}