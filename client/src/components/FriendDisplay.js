import React from 'react';
import '../styles/Friends.css'

export default function FriendDisplay({ name, userId }) {
    const [isInvited, setIsInvited] = React.useState('Invite')

    // get a user from his id
    async function getUser(id) {
        const response = await fetch('/getAuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: id })
        });
        const data = await response.json();
        return data[0];
    }

    // function to send invites
    async function sendInvite(recepientId, recepient_name) {
        recepientId = parseInt(recepientId)
        const thisUser = await getUser(parseInt(localStorage.getItem('currUserID')))
        fetch('/inviting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                recepientId: recepientId,
                inviterId: parseInt(localStorage.getItem('currUserID')),
                inviter_name: thisUser.fullname,
                recepient_name: recepient_name
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setIsInvited('Invite sent!')
                }
            })
    }
    const handleInvite = (e, name) => {
        const thisUser = e.target.parentElement.parentElement.id.split('-')[1]
        if (thisUser) {
            sendInvite(thisUser, name);
        }
    }

    return (
        <div className='friend-req-tag'>
            <div className='friendProfilePic'>
                <img src='https://via.placeholder.com/150' alt='profile pic' />
            </div>
            <div className='friendInfo' id={`user-${userId}`}>
                <h3 className='friendName'>{name}</h3>
                <div className='friendActions'>
                    <button className='inviteBtn' onClick={(e) => handleInvite(e, name)}>{isInvited}</button>
                    <button className='removeBtn'>Remove</button>
                </div>
            </div>
        </div>
    )
}