import React from 'react';
import '../styles/Messages.css';
import TypingBar from './TypingBar';
import MessageTag from './MessageTag';
import Left from '../icons/left.png';
import moreIcon from '../icons/more.png';

import '../styles/Friends.css'


export default function Messages({ isLoggedIn }) {


    // function to get messages between two users
    const [contact_fullname, setContact_fullname] = React.useState('');
    const [messages, setMessages] = React.useState([]);

    React.useEffect(() => {

        if (messages.length >= 0) {
            const currentUser = parseInt(localStorage.getItem('currUserID'));
            const receiver = parseInt(localStorage.getItem('receiver'));
            const messagesLength = messages.length;
            if (messagesLength === 0) {
                // getMessages(receiver, contact_fullname);
            }
            else if (parseInt(messages[messagesLength - 1].sender_id) === receiver && parseInt(messages[messagesLength - 1].receiver_id) === currentUser) {
                createMessages(messages, contact_fullname);
            }
        }
    }, [messages]);

    function getMessages(receiver, contact_fullname) {
        const sender = localStorage.getItem('currUserID');

        fetch('/getMessages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ receiver: receiver, sender: parseInt(sender) })
        })
            .then(response => response.json())
            .then(data => {
                console.log('messages', data);
                setMessages(data);
                setContact_fullname(contact_fullname);
                createMessages(data, contact_fullname);
            })
            .catch(error => console.error('Error fetching messages:', error));

    }


    // state of messages (are we inside a conversation or in the contacts)
    // when clicked on a message tag, it should display the messages between them
    function displayMessages(e, contact_fullname) {
        // display messages between the user and the selected contact
        const messageTag = e.target.closest('.message-req-tag');

        console.log(messageTag);
        setMessages(true);
        setContact_fullname(contact_fullname);
        localStorage.setItem('receiver', messageTag.dataset.friendId);
        getMessages(parseInt(messageTag.dataset.friendId), contact_fullname);

    }


    // function to create messages
    const [messagesHTML, setMessagesHTML] = React.useState([]);
    function createMessages(messages, contact_fullname, noMessages) {
        // console.log(messages);
        const currUser = parseInt(localStorage.getItem('currUserID'));
        if (noMessages) {
            const messagesHTML = (
                <>
                    <div className='noMessages'>
                        <h3>{noMessages}</h3>
                    </div>
                </>
            );
            setMessagesHTML(messagesHTML);
            return;
        }
        const messagesLen = messages.length;
        const messagesHTML = (
            <>
                {messagesLen + 1 && messages.map(message => (
                    <div key={message.id} className={`message ${message.sender_id === currUser ? 'currentUserMessage' : 'senderUser'}`} data-sender={message.sender_id} data-receiver={message.receiver_id}>
                        <p>{message.content}</p>
                        <span className='date'>{message.date_sent.split('T')[1].slice(0, 5)}</span>
                    </div>
                ))}
            </>
        );
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
        fetch('/getMyFriends', {
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
                        <h3>{contact_fullname}</h3>
                        <div className='messageActions' >
                            <img src={moreIcon} alt='more' className='msgMoreIcon' />
                        </div>
                    </div>
                    {messagesHTML}
                    <div ref={messagesEndRef} /> {/* Invisible element to scroll into view */}
                    <TypingBar getMessages={getMessages} setMessages={setMessages} />
                </div>
            }
        </div>
    )
}