const express = require('express');
const session = require('express-session');
const http = require('http');
const store = new session.MemoryStore();
const app = express();
const socketIo = require('socket.io');
const port = process.env.PORT || 5000;
const path = require('path');

// allow cros origin from https://chatapp-server-ten.vercel.app
const allowedOrigins = ['https://chatapp-client-jet.vercel.app', 'https://chatapp-server-ten.vercel.app'];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});


const server = http.createServer(app);
const WebSocket = require('ws');


const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {

        let parsedMessage;
        try {
            parsedMessage = JSON.parse(message);
        } catch (e) {
            console.error('Error parsing message:', message, e);
            // Optionally, you can send a message back to the client indicating the error
            ws.send(JSON.stringify({ success: false, message: 'Invalid JSON format' }));
            return; // Stop further processing
        }
        console.log('%s', parsedMessage.actions);
        if (parsedMessage.action === 'sendMessage') {
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    const { content, receiver, sender } = parsedMessage.message;
                    console.log(content, receiver, sender);
                    const data = {
                        content: content,
                        receiver_id: parseInt(receiver),
                        sender_id: parseInt(sender),
                        date_sent: new Date()
                    }
                    // console.log('data', data);
                    client.send(JSON.stringify(data));
                }
            })
            sendMessage(parsedMessage.message, ws);

        }
    });

    ws.on('error', function error(err) {
        console.error('WebSocket error:', err);
    });

});


// app.use(express.static(path.join(__dirname, '../client/build')));
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname + '../client/build/index.html'));

// });


const loginAdmin = 'sqladmin';
const password = process.env.PASSWORD;
const host = process.env.HOST;

// connect to db
const mysql = require('mysql');
const { connect } = require('http2');
const { resourceLimits } = require('worker_threads');
const { escape } = require('querystring');
const connection = mysql.createConnection({
    host: host,
    user: loginAdmin,
    password: password,
    database: 'chatappDB',
    multipleStatements: true
});

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to Db');
        console.log(err);
        return;
    }
    console.log('Connected to DB');

});

// function to proccess the time
const timeago = require('timeago.js');

function getRelativeTime(dateString) {
    return timeago.format(dateString);
}

app.use(express.json());
// middleware function
// app.use((req, res, next) => {
//     console.log(store);
//     console.log('Time:', Date.now());
//     next();
// });
app.get('/', (req, res) => {
    res.send('Hello from node!');
});
app.get('/submit-data', (req, res) => {
    const data = req.body;
    // console.log(data);
    res.send('Data received');
    res.json({
        success: true,
        message: 'Data received successfully',
        data: data
    });

})
function sendMessage(messageData, ws) {
    const { content, receiver, sender } = messageData;
    // console.log(messageData);
    // console.log(message, receiver, sender);
    const data = {
        content: content,
        receiver_id: parseInt(receiver),
        sender_id: parseInt(sender),
        date_sent: new Date()
    }
    const query = 'INSERT INTO messages SET ?';
    connection.query(query, data, (err, response) => {
        if (err) throw err;
        ws.send(JSON.stringify({ success: true, message: 'Message sent' }));

    })
}
app.post('/sendMessage', (req, res) => {
    const { message, receiver, sender } = req.body;
    // console.log(message, receiver, sender);
    const data = {
        content: message,
        receiver_id: receiver,
        sender_id: sender,
        date_sent: new Date()
    }
    const query = 'INSERT INTO messages SET ?';
    connection.query(query, data, (err, response) => {
        if (err) throw err;
        res.json({
            success: true,
            message: 'Data received',
            data: message
        });
    })
})
// get messages
app.post('/getMessages', (req, res) => {
    const { receiver, sender } = req.body;
    const query = 'SELECT * FROM messages WHERE receiver_id = ? AND sender_id = ? OR receiver_id = ? AND sender_id = ? ORDER BY date_sent ASC';
    connection.query(query, [receiver, sender, sender, receiver], (err, response) => {
        if (err) throw err;
        // console.log(response);
        res.json(response);
    })
})

// creating account
app.post('/createAccount', (req, res) => {
    const data = req.body;
    // console.log(data);
    data.date_created = new Date();
    const getUser = 'SELECT * FROM users WHERE username = ?';
    connection.query(getUser, data.username, (err, response) => {
        if (err) {
            throw err;
        };
        if (response.length > 0) {
            res.json({
                success: false,
                message: 'Username already exists',
            });
            return;
        }
        if (response.length === 0) {
            const insertUser = 'INSERT INTO users SET ?';
            connection.query(insertUser, data, (err, response) => {
                if (err) {
                    throw err;
                }
                else {
                    console.log('Account created');
                    res.json({
                        success: true,
                        message: 'Account created',
                        data: data
                    });
                }
            });
        }
    });
})
//login
app.post('/login', (req, res) => {
    const data = req.body;
    // console.log(req.sessionID);
    connection.query('SELECT * FROM users WHERE username = ?', data.username, (err, response) => {
        if (err) {
            throw err;
        };

        if (response.length > 0 && data.password === response[0].password) {
            console.log('Login success');
            res.json({
                success: true,
                username: response[0].username,
                fullname: response[0].fullname,
                id: response[0].id
            })
            console.log(res);
        } else {
            console.log('Login failed');
            res.json({
                success: false,
                message: 'incorrect username or password',
            });
        }
    });

})
// fettch all users
app.post('/friends', (req, res) => {
    const { user_id } = req.body;
    connection.query('SELECT id, username, fullname, date_created, bio FROM users WHERE id != ?', user_id, (err, response) => {
        if (err) {
            throw err;
        };

        res.json(response);
    });

})

// handling invites
app.post('/inviting', (req, res) => {
    const { recepientId, inviterId, inviter_name, recepient_name } = req.body;
    // insert the invite into the friends table
    const checkQuery = "SELECT * FROM friends WHERE (user_id1 = ? AND user_id2 = ? OR user_id1 = ? AND user_id2 = ?) AND (status = 'pending' OR status = 'accepted') ";

    connection.query(checkQuery, [recepientId, inviterId, inviterId, recepientId], (checkErr, checkResult) => {
        if (checkErr) {
            console.error('Error checking for existing invite:', checkErr);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (checkResult.length > 0) {
            // Invite already exists
            console.log('invite already sent');
            return res.json({ success: false, message: 'Invite already sent' });
        } else {
            // Insert the invite into the friends table
            const insertQuery = "INSERT INTO friends(user_id1, user_id2, inviter_name, recepient_name ,status) VALUES (?, ?, ?, ?, 'pending')";
            connection.query(insertQuery, [inviterId, recepientId, inviter_name, recepient_name], (insertErr, insertResult) => {
                if (insertErr) {
                    console.error('Error inserting invite:', insertErr);
                    return res.status(500).json({ success: false, message: 'Internal server error' });
                }

                console.log('Invite sent');
                res.json({ success: true, message: 'Invite sent' });
            });
        }
    });
})

// checking for any invites for a certain user

app.post('/checkforInvites', (req, res) => {
    const { inviterId } = req.body
    // console.log(inviterId);
    const checkInvites = "SELECT * FROM friends WHERE user_id2 = ? AND status = 'pending'";
    connection.query(checkInvites, inviterId, (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            res.json({ success: true, result: result })
        }
    })
})

// delete a request
app.post('/delete_request', (req, res) => {
    const { user_id1, user_id2 } = req.body
    console.log(user_id1, user_id2);

    const query = "DELETE FROM friends WHERE user_id1 = ? AND user_id2 = ? AND status = 'pending'";
    connection.query(query, [user_id1, user_id2], (err, response) => {
        if (err) throw err;

        res.json({ success: true });
    })
})

// accept request
app.post('/accept_request', (req, res) => {
    const { user_id1, user_id2 } = req.body;
    console.log(user_id1, user_id2);
    const query = "UPDATE friends SET status = 'accepted' WHERE user_id1 = ? AND user_id2 = ?";
    connection.query(query, [user_id1, user_id2], (err, response) => {
        if (err) throw err;
        res.json({ success: true });
    })
})
// handling post
app.post('/post', (req, res) => {
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
})

// fetching posts from the database
app.get('/getPosts', (req, res) => {
    // const query = 'SELECT * FROM posts ORDER BY post_date DESC';
    const query = `
SELECT posts.*,
       (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.post_id) AS like_count,
       (SELECT COUNT(*) FROM dislikes WHERE dislikes.post_id = posts.post_id) AS dislike_count 
FROM posts
ORDER BY posts.post_date DESC`;
    connection.query(query, (err, response) => {
        if (err) throw err;

        response = response.map(post => {
            return {
                post_id: post.post_id,
                content: post.content,
                user_id: post.user_id,
                name: post.name,
                post_date: getRelativeTime(post.post_date),
                like_count: post.like_count,
                dislike_count: post.dislike_count
            }
        });
        res.json(response);
    });
})

// like a post
app.post('/like', (req, res) => {
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
})

// deslike a post 
app.post('/dislike', (req, res) => {
    const { post_id, user_id, disliked_by } = req.body;
    const data = {
        post_id: post_id,
        user_id: user_id,
        disliked_by: disliked_by,
        like_date: new Date()
    }
    const query = 'DELETE FROM likes WHERE post_id = ? AND user_id = ? AND liked_by = ?';
    connection.query(query, [post_id, user_id, disliked_by], (err, response) => {
        if (err) throw err;
        const query = "INSERT INTO dislikes SET ?";
        connection.query(query, data, (err, response) => {
            if (err) throw err;
            res.json({ success: true });
        });
    });
})

// get a certain user from database
app.post('/getAuser', (req, res) => {
    const { user_id } = req.body
    const query = 'SELECT * FROM users WHERE id = ?';
    connection.query(query, user_id, (err, response) => {
        if (err) throw err;

        res.json(response);
    });
})

// fetch all my friends
app.post('/getMyFriends', (req, res) => {
    const { user_id } = req.body;
    const query = 'SELECT * FROM friends WHERE (user_id1 = ? OR user_id2 = ?) AND status = "accepted"';
    connection.query(query, [parseInt(user_id), parseInt(user_id)], (err, response) => {
        if (err) throw err;
        response = response.map(friend => {
            return {
                friend_fullname: friend.user_id1 == user_id ? friend.recepient_name : friend.inviter_name,
                recepient_name: friend.recepient_name,
                inviter_name: friend.inviter_name,
                friend_id: friend.user_id1 == user_id ? friend.user_id2 : friend.user_id1
            }
        });
        res.json(response);
    });
})

// get user'sdata from the database
app.get('/api/users/:id', (req, res) => {
    const query = 'SELECT id, fullname, username, age, bio, date_created FROM users WHERE id = ?';
    connection.query(query, req.params.id, (err, response) => {
        if (err) throw err;
        res.json(response);
    });
})

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});