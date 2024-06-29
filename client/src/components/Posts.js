import React from 'react';
import '../styles/Posts.css';
import likeBtn from '../icons/like-full.png';
import dislikeBtn from '../icons/dislike-full.png';
import commentBtn from '../icons/comment.png';
import saveBtn from '../icons/save.png';

import Comments from './Comments';

export default function Posts({ data }) {
    // state of textarea
    const [textArea, settextArea] = React.useState('');
    const handleChange = (e) => {
        settextArea(e.target.value);
    }
    // display of comments
    const [comments, setComments] = React.useState(false);
    const handleComments = (e) => {
        setComments(!comments);
    }
    return (
        <div className='postsPage'>
            <div className='writeYourPost'>
                <h1>Write Your Post</h1>
                <textarea placeholder='what are you thinking?' value={textArea} onChange={handleChange}></textarea>
                <button className='postBtn'>Post</button>
            </div>
            <div className='postsArea'>
                <h1>Posts</h1>
                <div className='outerPost'>
                    <div className='post'>
                        <div className='postHeader'>
                            <div className='profilePic'>
                                <img src='https://via.placeholder.com/150' alt='profile' />
                            </div>
                            <div className='postInfo'>
                                <h3 className='postAuthor'>John Doe</h3>
                                <p className='postDate'>yesterday at 12</p>
                            </div>
                        </div>
                        <div className='postContent'>
                            <p>Here is the post content, some more content. a little more content...</p>
                        </div>
                        <div className='postActions'>
                            <button className='likeBtn'>
                                <img src={likeBtn} alt='like' />
                            </button>
                            <button className='dislikelikeBtn'>
                                <img src={dislikeBtn} alt='like' />
                            </button>
                            <button className='commentBtn' onClick={handleComments}>
                                <img src={commentBtn} alt='like' />
                            </button>
                            <button className='saveBtn'>
                                <img src={saveBtn} alt='like' />
                            </button>
                        </div>
                    </div>

                    {comments && <Comments />}
                </div>
            </div>
        </div >
    )
}