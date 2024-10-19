// this file includes anything related to posts handling (posting, liking, disliking, commenting, sharing, fetching posts)

const connection = require('./db_connection');
const timeago = require('timeago.js');

function getRelativeTime(dateString) {
  return timeago.format(dateString);
}
// handling post
const post = (req, res) => {
  const { content, user_id, name } = req.body;
  const data = {
    content: content,
    user_id: user_id,
    name: name,
    post_date: new Date()
  }
  const query = 'INSERT INTO posts SET ?';
  connection.query(query, data, (err, response) => {
    if (err) throw err;
    res.json({
      success: true,
      message: 'Post created',
      data: data
    });
  });
}

// fetching posts from the database
const getPosts = (req, res) => {
  // const query = 'SELECT * FROM posts ORDER BY post_date DESC';
  const query = `
SELECT posts.*,
       (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS like_count,
       (SELECT COUNT(*) FROM dislikes WHERE dislikes.post_id = posts.id) AS dislike_count,
       (SELECT profilePic_link FROM users WHERE users.id = posts.user_id) AS profilePic_link
FROM posts
ORDER BY posts.post_date DESC`;
  connection.query(query, (err, response) => {
    if (err) throw err;

    response = response.map(post => {
      return {
        post_id: post.id,
        content: post.content,
        user_id: post.user_id,
        name: post.name,
        post_date: getRelativeTime(post.post_date),
        like_count: post.like_count,
        dislike_count: post.dislike_count,
        profilePic_link: post.profilePic_link
      }
    });
    res.json(response);
  });
}

// like a post
const handleLike = (req, res) => {
  const { post_id, user_id, liked_by } = req.body;
  const data = {
    post_id: post_id,
    user_id: user_id,
    liked_by: liked_by,
    like_date: new Date()
  }
  // check if user already liked that post
  const checkQuery = 'SELECT * FROM likes WHERE post_id = ? AND user_id = ? AND liked_by = ?';
  connection.query(checkQuery, [post_id, user_id, liked_by], (err, response) => {
    if (err) throw err;
    if (response.length > 0) {
      res.json({
        success: false,
        message: 'You already liked this post'
      });
      const query = 'DELETE FROM likes WHERE post_id = ? AND user_id = ? AND liked_by = ?';
      connection.query(query, [post_id, user_id, liked_by], (err, response) => {
        if (err) throw err;
      });
      return false;
    } else {
      const query = 'INSERT INTO likes SET ?; DELETE FROM dislikes WHERE post_id = ? AND user_id = ? AND disliked_by = ?';
      connection.query(query, [data, post_id, user_id, liked_by], (err, response) => {
        if (err) throw err;
        res.json({
          success: true
        });
      });

    }
  })
}

// deslike a post 
const handleDislike = (req, res) => {
  const { post_id, user_id, disliked_by } = req.body;
  const data = {
    post_id: post_id,
    user_id: user_id,
    disliked_by: disliked_by
  };
  const query = 'DELETE FROM likes WHERE post_id = ? AND user_id = ? AND liked_by = ?';
  connection.query(query, [post_id, user_id, disliked_by], (err, response) => {
    if (err) throw err;
    const query = "INSERT INTO dislikes SET ?";
    connection.query(query, data, (err, response) => {
      if (err) throw err;
      res.json({ success: true });
    });
  });
};


// exporting 
module.exports = {
  handleLike,
  handleDislike,
  post,
  getPosts
}