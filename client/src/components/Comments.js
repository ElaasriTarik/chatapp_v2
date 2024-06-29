import React from 'react';

export default function Comments() {
    return (
        <div className='comments'>
            <div className='comment'>
                <div className='commentHeader'>
                    <div className='profilePic'>
                        <img src='https://via.placeholder.com/150' alt='profile' />
                    </div>
                    <div className='commentInfo'>
                        <h3 className='commentAuthor'>John Doe</h3>
                        <p className='commentDate'>yesterday at 12</p>
                    </div>
                </div>
                <div className='commentContent'>
                    <p>Here is the comment content, some more content. a little more content...</p>
                </div>

            </div>
        </div>
    )
}