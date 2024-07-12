import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './Home.js'
import FetchData from './FetchData.js';

import Options from './components/Options';
import Notification from './components/Notifications';

import { BrowserRouter, Routes, Route } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Home />
      <Routes>
        {/* <Route path="/" element={<Posts />} /> */}
        <Route path="/fetch" element={<FetchData />} />
        {/* <Route path="/createAccount" element={<CreateAccounts />} /> */}
        {/* <Route path="/login" element={<Login />} /> */}

        {/* <Route path='/messages' element={<Messages />} /> */}
        {/* <Route path='/friends' element={<Friends />} /> */}
        <Route path='/notification' element={<Notification />} />
        <Route path='/options' element={<Options />} />
        {/* <Route path='/' element={<Posts />} /> */}

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
