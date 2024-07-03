import React from "react";
import FriendDisplay from './FriendDisplay';


export default function FriendReqs({ invites }) {
    console.log(invites);
    const [invitersData, setInvitersData] = React.useState([]);

    // React.useEffect(() => {
    //     const fetchInviters = async () => {
    //         const responses = await Promise.all(invites.map(item =>
    //             fetch('/getAuser', {
    //                 method: 'POST',
    //                 headers: { 'Content-Type': 'application/json' },
    //                 body: JSON.stringify({ user: item.user_id1 })
    //             }).then(response => response.json())
    //         ));
    //         setInvitersData(responses);
    //     };

    //     fetchInviters().catch(console.error);
    // }, [invites]);
    return (
        <div className='firends-sugg-tag friend-reqs-page'>
            <h2>Friend requests</h2>
            {
                invites.map((item) => {
                    <FriendDisplay name={item.id} key={item.id} userId={item.id} />
                })
            }
        </div>
    )
}