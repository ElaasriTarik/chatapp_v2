import React from 'react';
import './createAccounts.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

export default function Login() {
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
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputValues)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success === true) {
                    console.log('Log in success');
                    // save the sender's username/id in local storage
                    localStorage.setItem('currUser', inputValues.username);
                    // go to home page after login succes
                    window.location.href = '/';
                }
                console.log(data.message);
            })
            .catch(error => console.error('Error logging in:', error));
    }
    return (
        <div className="container">
            <h1>Log-in</h1>
            <div className='inputFields'>
                <input type='text' placeholder='Username' className='input' onChange={(e) => handleChange(e)} id='username' />
                <input type='text' placeholder='Password' className='input' onChange={(e) => handleChange(e)} id='password' />
                <button className='createButton' onClick={createAcc}>Log-in</button>
                <p>Don't have an account? <Link to='/createAccount'>Create</Link></p>
            </div>
        </div>
    )
}