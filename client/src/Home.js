import React from 'react';
import Header from './Header';
import TypingBar from './components/TypingBar';

import Body from './components/Body';

import './index.css';
import Users from './Users';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export default function Home(props) {
    const [usersData, setUsersData] = React.useState([]);

    // get all messages between two people
    const [messages, setMessages] = React.useState([]);
    function getMessages(receiver) {
        const sender = localStorage.getItem('currUser');
        console.log(receiver);
        fetch('/getMessages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ receiver: receiver, sender: sender })
        })
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                setMessages(data);
                createMessages(data);
            })
            .catch(error => console.error('Error fetching messages:', error));

    }
    const [messagesHTML, setMessagesHTML] = React.useState([]);
    function createMessages(messages) {
        // console.log(messages);
        const currUser = localStorage.getItem('currUser');
        const messagesHTML = (
            <>
                {messages.map(message => (
                    <div key={message.id} className={`message ${message.author === currUser ? 'currentUserMessage' : 'senderUser'}`} data-sender={message.author} data-receiver={message.receiver}>
                        <p>{message.content}</p>
                        <span className='date'>{message.date_sent.split('T')[1].slice(0, 5)}</span>
                    </div>
                ))}
            </>
        );
        setMessagesHTML(messagesHTML);

    }
    // make the contact menu visible when triggering the menu button when the dom is loaded
    // document.addEventListener('DOMContentLoaded', () => {
    function menuClicked() {
        const menuBtn = document.querySelector('.menu');
        const usersSideBar = document.querySelector('.usersSideBar');
        console.log(usersSideBar.dataset.visible);
        if (usersSideBar.dataset.visible === 'false') {
            usersSideBar.style.transform = 'translateX(100%)';
            usersSideBar.style.transition = 'all .5s ease-in-out';
            usersSideBar.dataset.visible = 'true';
            return;
        } if (usersSideBar.dataset.visible === 'true') {
            usersSideBar.style.transform = 'translateX(0%)';
            usersSideBar.style.transition = 'all .5s ease-in-out';
            usersSideBar.dataset.visible = 'false';
            return;
        }
    }

    function signoutTrigger() {
        localStorage.clear();
    }

    return (

        <div className="container">
            {/* this part contains all users */}
            <div className='usersSideBar' data-visible='false'>
                <div className='header-name'>
                    <h2>Contacts</h2>
                </div>
                {usersData.map(user => <Users key={user.id} data={user} getMessagesFunc={(receiver) => getMessages(receiver)} />)}
                <div className='signouttArea'>
                    <a href='/login' className='signout' onClick={signoutTrigger}>Sign-out</a>
                </div>
            </div>

            {/* end of users sidebar */}

            <Header />

            {/* <div className='messagesArea'>
                {messagesHTML}
            </div> */}
            <Body />

            {/* <TypingBar /> */}
        </div>
    )
}