import React from "react";
import Message from '../icons/messages.png';

export default function MyFriendsList() {
  const REACT_APP_SERVER_URL = process.env.REACT_APP_API_URL;
  // get my firneds from the database
  const [friends, setFriends] = React.useState([]);
  function getMyFriends() {
    fetch(REACT_APP_SERVER_URL + '/getMyFriends', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: localStorage.getItem('currUserID')
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setFriends(data);
      })
  }
  React.useEffect(() => {
    getMyFriends();
  }, [])

  // handling the function to message a friend
  const handleMessage = (e) => {
    console.log('message button clicked');
  }

  return (
    <div className="friends-sugg-tag friends-list ">
      <h2>My Friends List</h2>
      {
        friends.map((friend) => {
          return (
            <div className='friend-tag' key={friend.user_id}>
              <div className='friendProfilePic'>
                <img src={friend.profilePic_link} alt='profile pic' />
              </div>
              <div className='friendInfo' id={`user-${friend.user_id}`}>
                <h3 className='friendName'>{
                  friend.friend_fullname
                }</h3>
              </div>
              <div className='friendActions'>
                <button className='messageBtn' onClick={handleMessage}><img src={Message} alt='message' /></button>
              </div>
            </div>
          )
        })
      }

    </div>
  )
}