import React from "react";
import Message from '../icons/messages.png';

export default function MyFriendsList() {
    // get my firneds from the database
    const [friends, setFriends] = React.useState([]);
    function getMyFriends() {
        fetch('/getMyFriends', {
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
    return (
        <div className="friends-sugg-tag friends-list">
            <h2>My Friends List</h2>
            {
                friends.map((friend) => {
                    return (
                        <div className='friend-tag' key={friend.user_id}>
                            <div className='friendProfilePic'>
                                <img src='https://via.placeholder.com/150' alt='profile pic' />
                            </div>
                            <div className='friendInfo' id={`user-${friend.user_id}`}>
                                <h3 className='friendName'>{friend.recepient_name === localStorage.getItem('currUser') ? friend.inviter_name : friend.recepient_name}</h3>
                            </div>
                            <div className='friendActions'>
                                <button className='messageBtn'><img src={Message} alt='message' /></button>
                            </div>
                        </div>
                    )
                })
            }

        </div>
    )
}