import React from 'react';
import { useNavigate } from 'react-router-dom';
import profileicon from '../icons/profile.png';
import saveIcon from '../icons/save.png';
import settingsIcon from '../icons/settings.png';
import logoutIcon from '../icons/logout.png';

import '../styles/OptionsPage.css';

import MyProfile from './MyProfile.js';

export default function Options() {
    const navigate = useNavigate();
    const handlLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    }
    const user_id = localStorage.getItem('currUserID');
    const handleUserProfile = (e) => {
        e.preventDefault();
        navigate(`/profile/${user_id}`);
    }
    return (
        <div className='optionsContainer'>
            <div className='options profileAction'>
                <img src={profileicon} alt='profile' />
                <a href='/profile' onClick={handleUserProfile}>Profile</a>
            </div>
            <div className='options saveAction'>
                <img src={saveIcon} alt='save' />
                <a href='home.html'>Saved</a>
            </div>
            <div className='options settingsAction'>
                <img src={settingsIcon} alt='settings' />
                <a href='home.html'>Settings</a>
            </div>
            <div className='options logoutAction' onClick={handlLogout}>
                <img src={logoutIcon} alt='logout' />
                <a href='home.html'>Logout</a>
            </div>
        </div>
    )
}