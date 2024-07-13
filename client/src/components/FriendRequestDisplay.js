import React from 'react';
import '../styles/Friends.css'

export default function FriendRequestDisplay({ name, userId }) {
    // handle accept choice
    const [acceptedState, setAcceptedState] = React.useState('Accept')
    const handleAccept = (e) => {
        console.log('arequest accepted');
        fetch('/accept_request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id2: parseInt(localStorage.getItem('currUserID')),
                user_id1: userId
            })
        })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    setAcceptedState('Accepted');
                    console.log('friend request accepted!');
                }
            })
    }

    // handle decline choice
    const [DeclinedState, setDeclinedState] = React.useState('Decline')
    const handleDecline = (e) => {
        // console.log('request declined');
        fetch('/delete_request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id2: parseInt(localStorage.getItem('currUserID')),
                user_id1: userId
            })

        })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    setDeclinedState('Declined');
                    console.log('friend request declined!');
                }
            })
    }
    return (
        <div className='friend-req-tag'>
            <div className='friendProfilePic'>
                <img src='https://via.placeholder.com/150' alt='profile pic' />
            </div>
            <div className='friendInfo' id={`user-${userId}`}>
                <h3 className='friendName'>{name}</h3>
                <div className='friendActions'>
                    <button className='inviteBtn' onClick={(e) => handleAccept(e)}>{acceptedState}</button>
                    <button className='removeBtn' onClick={(e) => handleDecline(e)}>{DeclinedState}</button>
                </div>
            </div>
        </div>
    )
}