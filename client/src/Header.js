import React from 'react';
import home from './icons/home.png';
import friends from './icons/friends.png';
import messages from './icons/messages.png';
import bell from './icons/bell.png';
import menu from './icons/menu.png';
import './styles/Header.css';
// import RedIndicator from './components/RedIndicator';
export default function Header() {
    return (
        <div className="header">
            <div className='header-sections'>
                <div className='section homeIcon'>

                    <a href='/'>
                        <img src={home} alt='home' />
                    </a>
                </div>
                <div className='section friendsSec'>
                    <a href='/friends'>
                        <img src={friends} alt='friends' />
                    </a>
                </div>
                <div className='section messagesSec'>
                    <a href='/messages'>
                        <img src={messages} alt='messages' />
                    </a>
                </div>
                <div className='section notificationSec'>
                    <a href='/notifications'>
                        <img src={bell} alt='notifications' />
                    </a>
                </div>
                <div className='section menuSec'>
                    <a href='/menu'>
                        <img src={menu} alt='menu' />
                    </a>
                </div>
            </div>
        </div>
    )
}
