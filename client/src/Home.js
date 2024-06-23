import React from 'react';
import sendLogo from './send2.png';
import menu from './menu.png';
import './index.css';
import Users from './Users';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function Home(props) {

    // listening on-type
    const [inputValue, setInputValue] = React.useState('');
    const handleChange = (e) => {
        setInputValue(e.target.value);
        // autoresizing textarea
        const changeHeight = () => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
            // margin-bottom: calc(154.8px - 3.5rem);
            const messageArea = document.querySelector('.messagesArea');
            messageArea.style.marginBottom = `calc(${e.target.scrollHeight}px - 2.7rem)`;
        }
        changeHeight();
    }
    // sending message to backend
    const sendMessage = () => {
        fetch('/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: inputValue, receiver: localStorage.getItem('receiver'), sender: localStorage.getItem('currUser') })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success === true) {
                    console.log('Message sent');
                    getMessages(localStorage.getItem('receiver'));
                    setInputValue('');
                    // make the textarea height back to normal
                    const textarea = document.querySelector('.input');
                    textarea.style.height = 'auto';
                    const messageArea = document.querySelector('.messagesArea');
                    messageArea.style.marginBottom = `.6rem`;
                } else {
                    console.log('Message not sent');
                }
            })
            .catch(error => console.error('Error sending message:', error));
    }


    // get all users
    const [usersData, setUsersData] = React.useState([]);

    React.useEffect(() => {
        const getUsers = () => {
            fetch('/getUsers')
                .then(response => response.json())
                .then(data => {
                    setUsersData(data);
                })
                .catch(error => console.error('Error fetching users:', error));
        };
        getUsers();
    }, []);

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
            {/* end of users sidebar */
            }
            <div className='header'>
                <div className='menu' onClick={menuClicked}>
                    <img src={menu} alt='menu' />
                </div>
                <div className='receiver'>
                    <h2>{localStorage.getItem('receiver')}</h2>
                </div>
            </div>
            <div className='messagesArea'>
                {messagesHTML}
            </div>
            <div className='typingBar'>
                <textarea placeholder='Type something...' className='input' onChange={(e) => handleChange(e)} value={inputValue} id='autoresizing'></textarea>
                <div className='sendButton' onClick={sendMessage}>
                    <img src={sendLogo} alt='send button' className='sendBtn' />
                </div>
            </div>
        </div>
    )
}