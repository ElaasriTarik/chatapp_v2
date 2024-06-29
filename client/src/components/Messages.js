import React from 'react';
import '../styles/Messages.css';
import TypingBar from './TypingBar';
import MessageTag from './MessageTag';
import Left from '../icons/left.png';
import moreIcon from '../icons/more.png';
export default function Messages() {
    // state of messages (are we inside a conversation or in the contacts)
    // when clicked on a message tag, it should display the messages between them
    function displayMessages(e) {
        // display messages between the user and the selected contact
        console.log(e.target);
        setMessages(true)
        getMessages('')
    }

    // function to get messages between two users
    const [messages, setMessages] = React.useState(true);
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

    function hideMessages() {
        console.log('hide messages');
        setMessages(false);
    }

    return (
        <div className='messagesContainer'>
            {messages ?
                <>
                    <h2>Your Messages</h2>
                    <MessageTag displayMessages={displayMessages} />
                    <MessageTag displayMessages={displayMessages} />
                    <MessageTag displayMessages={displayMessages} />
                    <MessageTag displayMessages={displayMessages} />
                </>
                :
                <div className='messagesArea'>
                    <div className='messagesHeader'>
                        <div className='backButton' onClick={hideMessages}>
                            <img src={Left} alt='back' className='backIcon' />
                        </div>
                        <h3>John Doe</h3>
                        <div className='messageActions' >
                            <img src={moreIcon} alt='more' className='msgMoreIcon' />
                        </div>
                    </div>
                    {messagesHTML}
                </div>
            }
            {/* <TypingBar /> */}
        </div>
    )
}