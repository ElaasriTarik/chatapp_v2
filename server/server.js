const express = require('express');
const session = require('express-session');
const store = new session.MemoryStore();
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
// making sessions for users

app.use(session({
    secret: 'some secret',
    cookie: { maxAge: 30000 },
    saveUninitialized: false,
    store
}));

const WebSocket = require('ws');

const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        // Broadcast incoming message to all clients except the sender
        console.log('received: %s', message);
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.send('Welcome to the chat!');
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
const connection = mysql.createConnection({
    host: host,
    user: loginAdmin,
    password: password,
    database: 'chatappDB'
});

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to Db');
        console.log(err);
        return;
    }
    console.log('Connected to DB');

});

app.use(express.json());
// middleware function
app.use((req, res, next) => {
    console.log(store);
    console.log('Time:', Date.now());
    next();
});
app.get('/', (req, res) => {
    res.send('Hello from node!');
});
app.get('/submit-data', (req, res) => {
    const data = req.body;
    console.log(data);
    res.send('Data received');
    res.json({
        success: true,
        message: 'Data received successfully',
        data: data
    });

})

app.post('/sendMessage', (req, res) => {
    const { message, receiver, sender } = req.body;
    // console.log(message, receiver, sender);
    const data = {
        content: message,
        receiver: receiver,
        author: sender,
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
    const query = 'SELECT * FROM messages WHERE receiver = ? AND author = ? OR receiver = ? AND author = ? ORDER BY date_sent ASC';
    connection.query(query, [receiver, sender, sender, receiver], (err, response) => {
        if (err) throw err;
        console.log(response);
        res.json(response);
    })
})

// creating account
app.post('/createAccount', (req, res) => {
    const data = req.body;
    console.log(data);
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
    console.log(req.sessionID);
    connection.query('SELECT * FROM users WHERE username = ?', data.username, (err, response) => {
        if (err) {
            throw err;
        };

        if (response.length > 0 && data.password === response[0].password) {
            console.log('Login success');
            if (req.session.authenticated) {
                res.json(req.session)
            } else {
                req.session.authenticated = true;
                req.session.user = {
                    username: data.username,
                    password: data.password,
                    success: true
                }
                res.json(req.session);
            }

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
app.get('/getUsers', (req, res) => {
    connection.query('SELECT * FROM users', (err, response) => {
        if (err) {
            throw err;
        };
        const users = response.map(user => {
            return {
                id: user.id,
                username: user.username,
                date_created: user.date_created,
                password: ''
            }
        });
        res.json(users);
    });

})


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});