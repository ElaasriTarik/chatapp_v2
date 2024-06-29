import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Friends from './Friends';
import Options from './Options';
import Notification from './Notifications';
import Messages from './Messages';
import Posts from './Posts';


export default function Body() {
    return (
        <Routes>
            <Route path='/messages' element={<Messages />} />
            <Route path='/friends' element={<Friends />} />
            <Route path='/notification' element={<Notification />} />
            <Route path='/menu' element={<Options />} />
            <Route path='/' element={<Posts />} />
        </Routes>
    )
}