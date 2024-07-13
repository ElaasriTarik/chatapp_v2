import React from 'react';
import '../styles/Friends.css';
import Message from '../icons/messages.png';


export default function MessageTag({ friend, displayMessages, handleMessage }) {
    // const socket = new WebSocket('ws://127.0.0.1:5000');

    // const handleClick = (e, friendName) => {
    //     e.stopPropagation();
    //     displayMessages(e, friendName);
    //     // Send a message when the tag is clicked
    //     // sendMessage(`Hello from ${friendName}`);
    // };


    return (
        <div className='message-req-tag' onClick={(e) => displayMessages(e, friend.friend_fullname)} data-friend-id={friend.friend_id}>
            {/* <div className='friend-tag' > */}
            <div className='friendProfilePic'>
                <img src='https://via.placeholder.com/150' alt='profile pic' />
            </div>
            <div className='friendInfo' id={`user-${friend.friend_id}`}>
                <h3 className='friendName'>{
                    friend.friend_fullname
                }</h3>
                <p className='init-chat-label'>Start chatting...</p>
            </div>
            <div className='friendActions'>
                <button className='messageBtn' onClick={handleMessage}><img src={Message} alt='message' /></button>
            </div>
        </div>
        // </div>
    )
}