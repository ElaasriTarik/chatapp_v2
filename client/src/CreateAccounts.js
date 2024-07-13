import React from 'react';
import './createAccounts.css';
import { Link, Navigate } from 'react-router-dom';

export default function CreateAccounts({ isLoggedIn }) {
    // listening on type
    const [inputValues, setInputValue] = React.useState({
        username: '',
        password: '',
        fullname: '',
        age: 0,
        bio: ''
    });


    const handleChange = (e) => {
        setInputValue(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }));
    }

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
                if (data.success === true) {
                    console.log('Account created');
                    // save the sender's username/id in local storage
                    localStorage.setItem('currUser', inputValues.username);
                    localStorage.setItem('currUserID', data.id);
                    // go to home page after login succes
                    window.location.href = '/';
                }
                console.log(data.message);

            })
            .catch(error => console.error('Error sending message:', error));
    }
    return (
        <div className="signupContainer">
            <h1>Create Account</h1>
            <div className='inputFields'>
                <input type='text' placeholder='Full name' className='input' onChange={(e) => handleChange(e)} id='fullname' />
                <input type='text' placeholder='Username' className='input' onChange={(e) => handleChange(e)} id='username' />
                <input type='number' placeholder='age' className='input' onChange={(e) => handleChange(e)} id='age' />
                <input type='password' placeholder='Password' className='input' onChange={(e) => handleChange(e)} id='password' />
                <textarea type='text' placeholder='Tell us something about yourself' className='input' onChange={(e) => handleChange(e)} id='bio' />
                <button className='createButton' onClick={createAcc}>Create</button>
                <p>Already have an account? <Link to='/login'>Login</Link></p>
            </div>
        </div>
    )
}