import React from "react";
import FriendRequestDisplay from './FriendRequestDisplay';


export default function FriendReqs({ invites }) {

    return (
        <div className='firends-sugg-tag friend-reqs-page'>
            <h2>Friend requests</h2>
            {
                invites.map((item) => {
                    return <FriendRequestDisplay name={item.inviter_name} key={item.id} userId={item.user_id1} />
                })
            }
        </div>
    )
}