import React from 'react';
import '../styles/Friends.css'
import FriendList from './FriendDisplay';
import RedIndicator from './RedIndicator';
import FriendReqs from './Friend_reqs';
import { readyException } from 'jquery';


export default function Friends() {
    // get list of users from the database
    const [users, setUsers] = React.useState([])
    function getUsers() {
        fetch('/friends')
            .then(res => res.json())
            .then(res => setUsers(res))
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
    const [pageDisplay, setPageDisplay] = React.useState(false);
    const changePage = () => {
        setPageDisplay(prev => !prev);
    }
    return (
        <div className='friendsContainer'>
            <div className='friends-actions'>
                <button className='friendsBtn'>
                    Friends</button>
                <button className='friendReqBtn' onClick={changePage}>
                    {invitesStatus && <RedIndicator />}
                    Friend Requests</button>
            </div>
            {!pageDisplay ? <div className='firends-sugg-tag'>
                <h2>Suggestions</h2>
                {
                    users.map((item) => {
                        return <FriendList name={item.fullname} key={item.id} userId={item.id} handleInvite={handleInvite} />
                    })
                }

            </div> :
                <FriendReqs invites={invites} />
            }
        </div>
    )
}