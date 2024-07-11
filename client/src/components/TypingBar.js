import React from "react";
import sendLogo from '../icons/send2.png';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
// import io from 'socket.io-client';


export default function TypingBar({ getMessages, setMessages }) {

    const [socket, setSocket] = React.useState(null);
    React.useEffect(() => {
        const socket = new W3CWebSocket('ws://localhost:5000');
        setSocket(socket);

        socket.onopen = function () {
            console.log("[open] Connection established");
            // socket.send("Hello, server");
        };
        socket.onmessage = function (event) {
            // console.log("[message] Data received from server:", event.data);
            const newMessage = JSON.parse(event.data);
            // console.log(newMessage);
            setMessages(prevMessages => [...prevMessages, newMessage]);
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
            receiver: parseInt(localStorage.getItem('receiver')), // Assuming you store the current user's ID in localStorage
            content: inputValue
        };
        socket.send(JSON.stringify({ action: 'sendMessage', message }));
        setInputValue(''); // Clear input field after sending
        getMessages(parseInt(localStorage.getItem('receiver')));
        // make the textarea height back to normal
        const textarea = document.querySelector('.input');
        textarea.style.height = 'auto';
        const messageArea = document.querySelector('.messagesArea');
        messageArea.style.marginBottom = `.6rem`;
        messageArea.scrollTop = messageArea.scrollHeight;
    }


    return (
        <div className='typingBar'>
            <textarea placeholder='Type something...' className='input' onChange={(e) => handleChange(e)} value={inputValue} id='autoresizing'></textarea>
            <div className='sendButton' onClick={sendMessage}>
                <img src={sendLogo} alt='send button' className='sendBtn' />
            </div>
        </div>
    )
}