import React from 'react';
import '../styles/Friends.css'
import moreIcon from '../icons/more.png';


export default function MessageTag({ displayMessages }) {
    console.log(displayMessages);
    return (
        <div className='message-req-tag' onClick={(e) => displayMessages(e)}>
            <div className='messageProfilePic'>
                <img src='https://via.placeholder.com/150' alt='profile pic' />
            </div>
            <div className='messageInfo'>
                <h3 className='contactName'>John Doe</h3>
                <p className='lastMsgDisplay'>Hello there...</p>
            </div>
            <div className='messageActions'>
                <img src={moreIcon} alt='more' className='msgMoreIcon' />
            </div>
        </div>
    )
}