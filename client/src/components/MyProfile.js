import React from 'react';
import Users from '../Users';
import '../styles/MyProfile.css';

export default function MyProfile() {
    // get this user's information from the database

    const user_id = parseInt(window.location.href.split('/').pop());
    const [user, setUser] = React.useState({});
    React.useEffect(() => {
        fetch('/api/users/' + user_id)
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

    return (
        <div className="myProfile">
            {/* <h1>My Profile</h1> */}
            <div className="profileInfo">
                <div className="profile-pic">
                    <img src="https://via.placeholder.com/150" alt="profile-pic" />
                </div>
                <div className="profileDetails">
                    <p className="fullname">{user.fullname}</p>
                    <p className="username">@{user.username}</p>
                    <p className="bio">"{user.bio}"</p>
                </div>
            </div>
        </div>
    )
}