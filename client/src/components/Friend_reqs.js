import React from "react";
import FriendRequestDisplay from './FriendRequestDisplay.js';


export default function FriendReqs({ invites }) {
    console.log(invites);
    return (
        <div className='friends-sugg-tag friend-reqs-page'>
            <h2>Friend requests</h2>
            {
                invites.map((item) => {
                    return <FriendRequestDisplay name={item.inviter_name} key={item.id} userId={item.user_id1} />
                })
            }
        </div>
    )
}