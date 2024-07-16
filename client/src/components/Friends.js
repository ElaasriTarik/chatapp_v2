import React from 'react';
import '../styles/Friends.css'
import FriendList from './FriendDisplay.js';
import RedIndicator from './RedIndicator.js';
import FriendReqs from './Friend_reqs.js';
import MyFriendsList from './MyFriendsList.js';



export default function Friends() {
    // toggle between friends and suggestions and requests
    const [currentPage, setCurrentPage] = React.useState('suggestions'); // Default to 'suggestions'

    // Handlers to set the current page
    const displayFriends = () => setCurrentPage('friends');
    const displayFriendRequests = () => setCurrentPage('friendRequests');
    const displaySuggestions = () => setCurrentPage('suggestions');

    // get list of users from the database
    const [users, setUsers] = React.useState([])
    function getUsers() {
        fetch('/friends', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: parseInt(localStorage.getItem('currUserID'), 10) })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(res => {
                console.log(res);
                setUsers(res);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }
    React.useEffect(() => {
        getUsers();
    }, [])
    // function to handle sendding invites


    // check is user has any invites when the button loads
    const [invitesStatus, setInvitesStatus] = React.useState(false)
    const [invites, setInvites] = React.useState([])

    function checkForInvites() {
        fetch('/checkforInvites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inviterId: parseInt(localStorage.getItem('currUserID')) })
        })
            .then(res => res.json())
            .then(res => {
                setInvitesStatus(true)
                setInvites(res.result)
            })
    }

    React.useEffect(() => {
        checkForInvites();
    }, []);

    return (
        <div className='friendsContainer'>
            <div className='friends-actions'>
                <button className='friendsBtn' onClick={displayFriends}>
                    Friends</button>
                <button className='friendReqBtn' onClick={displayFriendRequests}>
                    {invitesStatus && <RedIndicator />}
                    Friend Requests
                </button>
                <button className='suggestionsBtn' onClick={displaySuggestions}>
                    Suggestions
                </button>
            </div>
            {currentPage === 'suggestions' && (
                <div className='friends-sugg-tag'>
                    <h2>Suggestions</h2>
                    {users.map((item) => (
                        <FriendList name={item.fullname} key={item.id} userId={item.id} />
                    ))}
                </div>
            )}
            {currentPage === 'friends' && (
                <MyFriendsList />
            )}
            {currentPage === 'friendRequests' && (
                <FriendReqs invites={invites} />
            )}

        </div>
    )
}