import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import Friends from './Friends.js';
import Options from './Options.js';
import Notification from './Notifications.js';
import Messages from './Messages.js';
import Posts from './Posts.js';
import Login from '../Login.js';
import CreateAccounts from '../CreateAccounts.js';
import Home from '../Home.js';
import MyProfile from './MyProfile.js';


function PrivateRoute({ children, isLoggedIn }) {
    return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

export default function Body({ isLoggedIn }) {
    // check if user is logged in

    // if (!isLoggedIn()) {
    //     return (
    //         <>
    //             <Navigate to="/login" />
    //         </>);
    // }
    return (
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path="/createAccount" element={<CreateAccounts />} />
            {/* Wrap protected routes with the PrivateRoute component */}
            <Route path='/messages' element={<PrivateRoute isLoggedIn={isLoggedIn}><Messages /></PrivateRoute>} />
            <Route path='/friends' element={<PrivateRoute isLoggedIn={isLoggedIn}><Friends /></PrivateRoute>} />
            <Route path='/notification' element={<PrivateRoute isLoggedIn={isLoggedIn}><Notification /></PrivateRoute>} />
            <Route path='/menu' element={<PrivateRoute isLoggedIn={isLoggedIn}><Options /></PrivateRoute>} />
            <Route path='/profile' element={<PrivateRoute isLoggedIn={isLoggedIn}><MyProfile /></PrivateRoute>} />
            <Route path="/profile/:userId" element={<MyProfile />} />
            <Route path='/' element={<PrivateRoute isLoggedIn={isLoggedIn}><Posts /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}