import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './Home.js'
import FetchData from './FetchData.js';
import CreateAccounts from './CreateAccounts.js';
import Login from './Login.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fetch" element={<FetchData />} />
        <Route path="/createAccount" element={<CreateAccounts />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
