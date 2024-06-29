import React from 'react';
import '../styles/Friends.css'
import FriendList from './FriendDisplay';

export default function Friends() {
    return (
        <div className='friendsContainer'>
            <div className='friends-actions'>
                <button className='friendsBtn'>Friends</button>
                <button className='friendReqBtn'>Friend Requests</button>
            </div>
            <div className='firends-sugg-tag'>
                <h2>Suggestions</h2>
                <FriendList />
                <FriendList />
                <FriendList />
            </div>
        </div>
    )
}