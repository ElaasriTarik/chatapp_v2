import React from 'react';
import '../styles/Messages.css';
import TypingBar from './TypingBar.js';
import MessageTag from './MessageTag.js';
import Left from '../icons/left.png';
import moreIcon from '../icons/more.png';

import '../styles/Friends.css'


export default function Messages({ isLoggedIn }) {
    const REACT_APP_SERVER_URL = process.env.REACT_APP_API_URL;

    // function to get messages between two users
    const [contact_fullname, setContact_fullname] = React.useState('');
    const [isTyping, setIsTyping] = React.useState(false);
    const [messages, setMessages] = React.useState([]);

    React.useEffect(() => {

        if (messages.length > 0) {
            const currentUser = parseInt(localStorage.getItem('currUserID'));
            const receiver = parseInt(localStorage.getItem('receiver'));
            const messagesLength = messages.length;
            // if (messagesLength === 0) {
            //     console.log('No messages found');
            //     // setMessages({ id: 0, content: 'No messages found', status: 'noMessages' });
            //     createMessages([{ id: 0, content: 'No messages found', status: 'noMessages' }], 0);
            // }
            if (parseInt(messages[messagesLength - 1].sender_id) === receiver && parseInt(messages[messagesLength - 1].receiver_id) === currentUser) {
                createMessages(messages, 1);
            }
        }
    }, [messages]);

    function getMessages(receiver, contact_fullname) {
        const sender = localStorage.getItem('currUserID');

        fetch(REACT_APP_SERVER_URL + '/getMessages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ receiver: receiver, sender: parseInt(sender) })
        })
            .then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    console.log('empty chat');
                    setMessages([{ id: 0, content: 'No messages found', status: 'noMessages', date_sent: new Date().toISOString(), sender_id: 0, receiver_id: 1 }], contact_fullname);
                    createMessages(messages)
                } else {
                    console.log('messages', data);
                    setContact_fullname(contact_fullname);
                    setIsSeen(false);
                    setMessages(data);
                    createMessages(data, contact_fullname);
                }
            })
            .catch(error => console.error('Error fetching messages:', error));

    }


    // state of messages (are we inside a conversation or in the contacts)
    // when clicked on a message tag, it should display the messages between them
    function displayMessages(e, contact_fullname) {
        // display messages between the user and the selected contact
        const messageTag = e.target.closest('.message-req-tag');

        setMessages(true);
        console.log(contact_fullname);
        setContact_fullname(contact_fullname);
        localStorage.setItem('receiver', messageTag.dataset.friendId);
        setMessagesAsSeen(messageTag);
        getMessages(parseInt(messageTag.dataset.friendId), contact_fullname);
    }
    // set messages as seen
    function setMessagesAsSeen(messageTag) {
        fetch(REACT_APP_SERVER_URL + '/setMessagesAsSeen', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ receiver: parseInt(messageTag.dataset.friendId), sender: parseInt(localStorage.getItem('currUserID')) })
        })
            .then(res => res.json())
            .then(data => {
                console.log('seen');
            })
    }

    // function to create messages
    const [messagesHTML, setMessagesHTML] = React.useState([]);
    const [isSeen, setIsSeen] = React.useState(false);
    function createMessages(messages, noMessages) {
        // console.log(messages);
        const currUser = parseInt(localStorage.getItem('currUserID'));


        // return;
        const messagesLen = messages.length;
        const sortedMessages = messages.map(message => {
            // Convert timestamp to local time
            const localTime = new Date(message.timestamp).toLocaleString();
            return { ...message, timestamp: localTime };
        }).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        const messagesHTML = (
            <>
                {messagesLen + 1 && sortedMessages.map(message => (
                    <div key={message.id} className={`message ${message.sender_id === currUser ? 'currentUserMessage' : 'senderUser'}`} data-sender={message.sender_id} data-receiver={message.receiver_id}>
                        <p>{message.content}</p>
                        <span className='date'>{
                            message.date_sent.includes('T') ?
                                message.date_sent.split('T')[1].slice(0, 5)
                                :
                                message.date_sent.split(' ')[1].slice(0, 5)

                        }</span>
                    </div>
                ))}
            </>
        );
        if (sortedMessages[messagesLen - 1].seen = 'seen') {
            setIsSeen(true);
        }
        setMessagesHTML(messagesHTML);

    }

    function hideMessages() {
        setMessagesHTML([]);
        setContact_fullname('');
        setMessages([]);
    }
    // get my friends 
    const [friends, setFriends] = React.useState([]);
    function getMyFriends() {
        fetch(REACT_APP_SERVER_URL + '/getMyFriends', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: localStorage.getItem('currUserID')
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setFriends(data);
            })
    }
    React.useEffect(() => {
        getMyFriends();
    }, [])


    const handleMessage = (e) => {
        console.log('message button clicked');
    }

    // scroll to the bottom
    const messagesEndRef = React.useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {

            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages]);



    return (
        <div className='messagesContainer friends-list'>
            {messages.length === 0 ?
                <>
                    <h2>Your Messages</h2>
                    {
                        friends.map((friend) => {
                            return <MessageTag friend={friend} handleMessage={handleMessage} displayMessages={displayMessages} key={friend.user_id} />
                        })
                    }
                </>
                :
                <div className='messagesArea'>
                    <div className='messagesHeader'>
                        <div className='backButton' onClick={hideMessages}>
                            <img src={Left} alt='back' className='backIcon' />
                        </div>
                        <div className='MsgContactInfo'>
                            <h3>{contact_fullname}</h3>
                            {isTyping && <span className='typing'>Typing...</span>}

                        </div>
                        <div className='messageActions' >
                            <img src={moreIcon} alt='more' className='msgMoreIcon' />
                        </div>
                    </div>
                    {messagesHTML}
                    {isSeen && <p className='seen'>Seen</p>}
                    <div ref={messagesEndRef} /> {/* Invisible element to scroll into view */}
                    <TypingBar getMessages={getMessages} setMessages={setMessages} contact_fullname={contact_fullname} setIsTyping={setIsTyping} />
                </div>
            }
        </div>
    )
}