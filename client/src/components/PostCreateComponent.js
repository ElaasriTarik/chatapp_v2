import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Posts.css';
import likeBtn from '../icons/like.png';
import dislikeBtn from '../icons/dislike.png';
import commentBtn from '../icons/comment.png';
import saveBtn from '../icons/save.png';

import Comments from './Comments';
import MyProfile from './MyProfile';

export default function PostCreateComponent({ handleComments, comments, post }) {
    // state of likes and dislikes
    const [likes, setLikes] = React.useState(post.like_count);
    const [dislikes, setDislikes] = React.useState(post.dislike_count);
    // handling the like btn click
    const handleLikeBtn = (post_id, user_id) => {
        fetch('/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post_id: post_id,
                user_id: user_id,
                liked_by: localStorage.getItem('currUserID')
            })
        })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    setLikes(likes + 1);
                } else {
                    setLikes(likes - 1);
                }
            })
    }

    // handling the dislike btn click
    const handleDislikeBtn = (post_id, user_id) => {
        fetch('/dislike', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post_id: post_id,
                user_id: user_id,
                disliked_by: localStorage.getItem('currUserID')
            })
        })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    setDislikes(dislikes + 1);

                }
            })
    }


    // handling the username clicked
    const navigate = useNavigate();
    const handlUsernameClicked = (e) => {
        const author = parseInt(e.target.getAttribute('dataauthor'));
        navigate(`/profile/${author}`);
    }

    return (
        <div className='outerPost'>
            <div className='post'>
                <div className='postHeader'>
                    <div className='profilePic'>
                        <img src='https://via.placeholder.com/150' alt='profile' />
                    </div>
                    <div className='postInfo'>
                        <h3 className='postAuthor' dataauthor={`${post.user_id}`} onClick={(e) => handlUsernameClicked(e)}>{post.name}</h3>
                        <p className='postDate'>{post.post_date.split('T')[1].substring(0, 5)}</p>
                    </div>
                </div>
                <div className='postContent'>
                    <p>{post.content}</p>
                </div>
                <div className='postActions'>
                    <button className='likeBtn' onClick={() => handleLikeBtn(post.post_id, post.user_id)}>
                        <img src={likeBtn} alt='like' />
                        <span className='likes_count'>{likes}</span>
                    </button>
                    <button className='dislikelikeBtn' onClick={() => handleDislikeBtn(post.post_id, post.user_id)}>
                        <img src={dislikeBtn} alt='dislikelike' />
                        <span className='dislikes_count'>{dislikes}</span>
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
    )
}