import React from 'react';
import './Users.css'

export default function Users({ data, getMessagesFunc }) {
    const receiverSave = (e) => {
        localStorage.setItem('receiver', e.target.id);
        // highlight the selected contact
        const allContacts = document.querySelectorAll('.user');
        allContacts.forEach(contact => {
            if (contact.id !== e.target.id) {
                contact.classList.remove('selectedContact');
            }
        })
        e.target.className += ' selectedContact';

        getMessagesFunc(e.target.id);
    }

    function handleClick(e) {
        receiverSave(e);
    }

    return (
        <>
            {/* <Home messages={messages} /> */}
            {
                data.username !== localStorage.getItem('currUser') &&
                <div key={data.key} className='user' id={data.username} onClick={(e) => handleClick(e)} >
                    <p className="uncopiable">{data.username}</p>
                </div>
            }
        </>
    )
}