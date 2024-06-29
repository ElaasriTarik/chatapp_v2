import React from 'react';
import profileicon from '../icons/profile.png';
import saveIcon from '../icons/save.png';
import settingsIcon from '../icons/settings.png';
import logoutIcon from '../icons/logout.png';

import '../styles/OptionsPage.css';

export default function Options() {
    return (
        <div className='optionsContainer'>
            <div className='options profileAction'>
                <img src={profileicon} alt='profile' />
                <a href='#'>Profile</a>
            </div>
            <div className='options saveAction'>
                <img src={saveIcon} alt='save' />
                <a href='#'>Saved</a>
            </div>
            <div className='options settingsAction'>
                <img src={settingsIcon} alt='settings' />
                <a href='#'>Settings</a>
            </div>
            <div className='options logoutAction'>
                <img src={logoutIcon} alt='logout' />
                <a href='#'>Logout</a>
            </div>
        </div>
    )
}