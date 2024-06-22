import React from 'react';
import sendLogo from './send2.png';
import './index.css';
import Users from './Users';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function Home(props) {
    // listening on type
    const [inputValue, setInputValue] = React.useState('');
    const handleChange = (e) => {
        setInputValue(e.target.value);
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
    return (
        <div className="container">
            {/* this part contains all users */}
            <div className='usersSideBar'>
                <div className='header-name'>
                    <h2>Contacts</h2>
                </div>
                {usersData.map(user => <Users key={user.id} data={user} getMessagesFunc={(receiver) => getMessages(receiver)} />)}
            </div>
            {/* end of users sidebar */
            }
            <div className='header'>

            </div>
            <div className='messagesArea'>
                {messagesHTML}
            </div>
            <div className='typingBar'>
                <input type='text' placeholder='Type something...' className='input' onChange={(e) => handleChange(e)} value={inputValue} />
                <div className='sendButton' onClick={sendMessage}>
                    <img src={sendLogo} alt='send button' className='sendBtn' />
                </div>
            </div>
        </div>
    )
}