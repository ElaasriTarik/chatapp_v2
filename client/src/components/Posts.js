import React from 'react';
import '../styles/Posts.css';

import PostCreateComponent from './PostCreateComponent.js';


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
    // handling the sharing of the post
    const [postStatus, setPostStatus] = React.useState('Share');
    const handlePostBtn = () => {
        fetch('/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: textArea,
                user_id: localStorage.getItem('currUserID'),
                name: localStorage.getItem('currUser')
            })
        })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    console.log('post created');
                    setPostStatus('Shared!');
                    settextArea('');
                    getPosts();
                }
            })
    }

    // getting all post from the database
    const [posts, setPosts] = React.useState([]);
    React.useEffect(() => {
        getPosts();
    }, [])


    function getPosts() {
        fetch('/getPosts')
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setPosts(data);
            })
    }
    // end of javascript
    // start of react
    return (
        <div className='postsPage'>
            <div className='writeYourPost'>
                <h1>Write Your Post</h1>
                <textarea placeholder='what are you thinking?' value={textArea} onChange={handleChange} className="postInput"></textarea>
                <button className='postBtn' onClick={handlePostBtn}>{postStatus}</button>
            </div>
            <div className='postsArea'>
                <h1>Posts</h1>
                {
                    posts.map((post) => {
                        return <PostCreateComponent key={post.post_id} handleComments={handleComments} comments={comments} post={post} />
                    })
                }
            </div>
        </div >
    )
}