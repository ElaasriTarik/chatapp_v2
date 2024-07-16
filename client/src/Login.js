import React from 'react';
import './createAccounts.css';
import CreateAccounts from './CreateAccounts.js';
import { Link, Navigate } from 'react-router-dom';

export default function Login(props) {
    const REACT_APP_SERVER_URL = process.env.REACT_APP_API_URL;
    console.log(REACT_APP_SERVER_URL);
    const [createOrLogin, setCreateOrLogin] = React.useState(true);
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
    // console.log(inputValues);
    // sending message to backend
    function createAcc() {
        fetch(REACT_APP_SERVER_URL + '/login', {
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
                    // get user from cookie 

                    localStorage.setItem('currUser', inputValues.username);
                    localStorage.setItem('currUserID', data.id);
                    // props.setisLoggedIn(true)
                    // go to home page after login succes
                    window.location.href = '/';
                }
            })
            .catch(error => console.error('Error logging in:', error));
    }

    const handleCreateAcc = () => {
        setCreateOrLogin(false);
    }

    return (
        <>
            {createOrLogin ? (
                <>
                    <div className="loginContainer">
                        <h1>Log-in</h1>
                        <div className='inputFields'>
                            <input type='text' placeholder='Username' className='input' onChange={(e) => handleChange(e)} id='username' />
                            <input type='password' placeholder='Password' className='input' onChange={(e) => handleChange(e)} id='password' />
                            <button className='createButton' onClick={createAcc}>Log-in</button>
                            <p onClick={handleCreateAcc}>Don't have an account? <Link to='/createAccount'>Create</Link></p>
                        </div>
                    </div>
                </>
            ) : (
                <CreateAccounts />
            )}
        </>
    )
}