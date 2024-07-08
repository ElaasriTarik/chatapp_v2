import React from 'react';
import '../styles/Friends.css'
import FriendList from './FriendDisplay';
import RedIndicator from './RedIndicator';
import FriendReqs from './Friend_reqs';
import MyFriendsList from './MyFriendsList';



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
    function sendInvite(recepientId, recepient_name) {
        recepientId = parseInt(recepientId)
        fetch('/inviting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                recepientId: recepientId,
                inviterId: parseInt(localStorage.getItem('currUserID')),
                inviter_name: localStorage.getItem('currUser'),
                recepient_name: recepient_name
            })

        })
    }
    const handleInvite = (e, name) => {
        const thisUser = e.target.parentElement.parentElement.id.split('-')[1]
        console.log(name);
        if (thisUser) {
            sendInvite(thisUser, name);
        }
    }
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
    // which page to display
    // const [pageDisplay, setPageDisplay] = React.useState(false);
    // const changePage = () => {
    //     setPageDisplay(prev => !prev);
    // }
    // display friends
    // const [friendsDisplay, setFriendsDisplay] = React.useState(false);
    // const displayFriends = () => {
    //     setFriendsDisplay(true);
    //     setPageDisplay(false);
    //     setInvitesStatus(false);
    // }
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
                        <FriendList name={item.fullname} key={item.id} userId={item.id} handleInvite={handleInvite} />
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