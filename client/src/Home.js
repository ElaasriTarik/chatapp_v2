import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

import Body from './components/Body';
import Login from './Login';
import CreateAccounts from './CreateAccounts';
import './index.css';
import Users from './Users';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export default function Home() {
    const isLoggedIn = () => localStorage.getItem('currUserID') ? true : false;

    // if (!isLoggedIn()) {
    //     return <Navigate to="/login" />;
    // }
    function signoutTrigger() {
        localStorage.clear();
    }

    return (

        <div className="container">

            {/* end of users sidebar */}

            <Header />

            {/* <div className='messagesArea'>
                // {messagesHTML}
            </div> */}

            <Body isLoggedIn={isLoggedIn} />
            {/* <Routes>
                <Route path='/login' element={<Login />} />
                <Route path="/createAccount" element={<CreateAccounts isLoggedIn={isLoggedIn} />} />

            </Routes> */}
            {/* <TypingBar /> */}
        </div>
    )
}