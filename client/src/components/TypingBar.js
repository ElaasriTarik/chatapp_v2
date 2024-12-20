import React from "react";
import sendLogo from '../icons/send2.png';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import NotificationService from './Notifications.js';
// import io from 'socket.io-client';


export default function TypingBar({ getMessages, setMessages, contact_fullname, setIsTyping, setIsSeen }) {
  const REACT_APP_SERVER_URL = process.env.REACT_APP_API_URL;
  const [socket, setSocket] = React.useState(null);

  React.useEffect(() => {
    const socket = new W3CWebSocket(`wss://${REACT_APP_SERVER_URL.split('//')[1]}`);
    setSocket(socket);

    socket.onopen = function () {
      console.log("[open] Connection established");
      // socket.send("Hello, server");
    };
    socket.onmessage = function (event) {
      // console.log("[message] Data received from server:", event.data);
      const receiver = parseInt(localStorage.getItem('receiver'));
      const currentUser = parseInt(localStorage.getItem('currUserID'));
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.type === 'typing') {
        // console.log('typing notification', data);
        if (parseInt(data.sender_id) === receiver && parseInt(data.receiver_id) === currentUser) {
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 2500);
        }

      } else {
        setMessages(prevMessages => [...prevMessages, data]);
        // Show notification only if the message is not from the current user
        // and the window is not focused
        if (!document.hasFocus()) {
          // get the sender name
          fetch(`${REACT_APP_SERVER_URL}/getUserById`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: data.sender_id })
          })
            .then(response => response.json())
            .then(userData => {
              console.log(userData.fullname);
              NotificationService.showNotification(data.content, userData[0].fullname);
            })
          // NotificationService.showNotification(data.content, data.sender);
        }
      }
    };
    socket.onerror = function (event) {
      console.error("WebSocket error observed:", event);
    };
    socket.onclose = (event) => {
      console.log("[close] Connection closed:", event.reason);
    };
    // Cleanup function to close the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, []);

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
    const message = {
      sender: localStorage.getItem('currUserID'),
      receiver: parseInt(localStorage.getItem('receiver')),
      content: inputValue
    };
    socket.send(JSON.stringify({ action: 'sendMessage', message }));
    setInputValue(''); // Clear input field after sending
    // setting the messages as NOT SEEN
    setIsSeen(false);
    getMessages(parseInt(localStorage.getItem('receiver')), contact_fullname);
    // make the textarea height back to normal
    const textarea = document.querySelector('.input');
    textarea.style.height = 'auto';
    const messageArea = document.querySelector('.messagesArea');
    messageArea.style.marginBottom = `.6rem`;
    messageArea.scrollTop = messageArea.scrollHeight;
  }


  const handleTyping = (e) => {
    handleChange(e);

    // Send typing notification
    const typingNotification = {
      sender: localStorage.getItem('currUserID'),
      receiver: parseInt(localStorage.getItem('receiver')),
      action: 'typing',
    };
    socket.send(JSON.stringify(typingNotification));
  };


  // mark as seen
  const markMessageAsSeen = (messageId) => {
    const seenNotification = JSON.stringify({
      type: 'seen',
      messageId: messageId,
      senderId: localStorage.getItem('currUserID'),
      receiverId: parseInt(localStorage.getItem('receiver')),
    });
    socket.send(seenNotification);
  };

  return (
    <div className='typingBar'>
      <textarea placeholder='Type something...' className='input' onChange={handleTyping} value={inputValue} id='autoresizing'></textarea>
      <div className='sendButton' onClick={sendMessage}>
        <img src={sendLogo} alt='send button' className='sendBtn' />
      </div>
    </div>
  )
}
