import React from "react";
import sendLogo from '../icons/send2.png';

export default function TypingBar() {
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
                    // getMessages(localStorage.getItem('receiver'));
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
    return (
        <div className='typingBar'>
            <textarea placeholder='Type something...' className='input' onChange={(e) => handleChange(e)} value={inputValue} id='autoresizing'></textarea>
            <div className='sendButton' onClick={sendMessage}>
                <img src={sendLogo} alt='send button' className='sendBtn' />
            </div>
        </div>
    )
}