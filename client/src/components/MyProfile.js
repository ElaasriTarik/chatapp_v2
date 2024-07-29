import React from 'react';
import '../styles/MyProfile.css';


export default function MyProfile() {
  const REACT_APP_SERVER_URL = process.env.REACT_APP_API_URL;
  const [isInvited, setIsInvited] = React.useState('Invite')
  // get this user's information from the database

  const user_id = parseInt(window.location.href.split('/').pop());
  const [user, setUser] = React.useState({});
  React.useEffect(() => {
    fetch(REACT_APP_SERVER_URL + '/api/users/' + user_id)
      .then(response => response.json())
      .then(data => {
        if (data.length === 0) {
          window.location.href = '/404';
        }
        setUser(data[0]);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [])


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
        if (!data.seccess && data.message === 'Invite already sent') {
          setIsInvited('Pending...')
        }
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
    <div className="myProfile">
      {/* <h1>My Profile</h1> */}
      <div className="profileInfo">
        <div className="profile-pic">
          <img src={user.profilePic_link} alt="profile-pic" />
        </div>
        <div className="profileDetails" id={`user-${user_id}`}>
          <p className="fullname">{user.fullname}</p>
          <p className="username">@{user.username}</p>
          <p className="bio">"{user.bio}"</p>
          <div className='friendActions'>
            <button className='inviteBtn' onClick={(e) => handleInvite(e, user.fullname)}>{isInvited}</button>
            <button className='removeBtn'>Remove</button>
          </div>
        </div>
      </div>
    </div>
  )
}