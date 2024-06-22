import React from 'react';
import sendLogo from './send.png';
import './createAccounts.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

export default function CreateAccounts() {
    // listening on type
    const [inputValues, setInputValue] = React.useState({
        username: '',
        password: ''
    });
    const handleChange = (e) => {
        setInputValue(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }));
    }
    console.log(inputValues);
    // sending message to backend
    function createAcc() {
        fetch('/createAccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputValues)
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('Account created');
                    // save the sender's username/id in local storage
                    localStorage.setItem('currUser', inputValues.username);
                    // go to home page after login succes
                    window.location.href = '/';
                }
                console.log(data.message);

            })
            .catch(error => console.error('Error sending message:', error));
    }
    return (
        <div className="container">
            <h1>Create Account</h1>
            <div className='inputFields'>
                <input type='text' placeholder='Username' className='input' onChange={(e) => handleChange(e)} id='username' />
                <input type='text' placeholder='Password' className='input' onChange={(e) => handleChange(e)} id='password' />
                <button className='createButton' onClick={createAcc}>Create</button>
                <p>Already have an account? <Link to='/login'>Login</Link></p>
            </div>
        </div>
    )
}