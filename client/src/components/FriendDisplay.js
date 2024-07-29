import React from 'react';
import '../styles/Friends.css'
import { useNavigate } from 'react-router-dom';

export default function FriendDisplay({ name, userId, friend }) {
  const REACT_APP_SERVER_URL = process.env.REACT_APP_API_URL;
  const [isInvited, setIsInvited] = React.useState('Invite')

  // get a user from his id
  async function getUser(id) {
    const response = await fetch(REACT_APP_SERVER_URL + '/getAuser', {
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
    fetch(REACT_APP_SERVER_URL + '/inviting', {
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


  // clicking on a user should take you to his profile page
  const navigate = useNavigate();
  const handlUsernameClicked = (e) => {
    const user = parseInt(e.target.id.split('-')[1]);
    navigate(`/profile/${user}`);
  }
  return (
    <div className='friend-req-tag'>
      <div className='friendProfilePic'>
        <img src={friend.profilePic_link} alt='profile pic' />
      </div>
      <div className='friendInfo' id={`user-${userId}`}>
        <h3 className='friendName' id={`user-${userId}`} onClick={(e) => handlUsernameClicked(e)}>{name}</h3>
        <div className='friendActions'>
          <button className='inviteBtn' onClick={(e) => handleInvite(e, name)}>{isInvited}</button>
          <button className='removeBtn'>Remove</button>
        </div>
      </div>
    </div>
  )
}