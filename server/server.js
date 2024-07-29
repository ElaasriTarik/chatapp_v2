const express = require('express');
const session = require('express-session');
const http = require('http');
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');

// connection to database
const connection = require('./db_connection');


// importing functions from other files
const { handleDislike, post, handleLike, getPosts } = require('./posts_handling');
const { login, createAccount } = require('./accountsAndLogin');
const { sendMessage, setMessagesAsSeen, getMessages } = require('./messagesHandling');
const { suggestions, inviting, checkforInvites, delete_request, accept_request, getMyFriends } = require('./friendsAndusers');
const setupWebsocket = require('./websocket');


// allow cros origin from https://chatapp-server-ten.vercel.app
const allowedOrigins = ['https://chatapp-client-jet.vercel.app', 'https://chatapp-server-ten.vercel.app',
  'https://chatapp-v2-lwyx.onrender.com', 'http://localhost', 'http://localhost:3000', 'http://localhost:5000'];

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

setupWebsocket(server, allowedOrigins);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// handling posts routes
app.post('/dislike', handleDislike);
app.post('/like', handleLike);
app.get('/getPosts', getPosts);
app.post('/post', post);


// handling login/createaccount
app.post('/login', login);
app.post('/createAccount', createAccount);


// handling messages
app.post('/sendMessage', sendMessage);
app.post('/getMessages', getMessages);
app.post('/setMessagesAsSeen', setMessagesAsSeen);


// handling friends
app.post('/suggestions', suggestions);
app.post('/inviting', inviting);
app.post('/checkforInvites', checkforInvites);
app.post('/delete_request', delete_request);
app.post('/accept_request', accept_request);
app.post('/getMyFriends', getMyFriends);


app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from node!');
});


// get a certain user from database
app.post('/getAuser', (req, res) => {
  const { user_id } = req.body
  const query = 'SELECT * FROM users WHERE id = ?';
  connection.query(query, user_id, (err, response) => {
    if (err) throw err;

    res.json(response);
  });
})

// get user'sdata from the database
app.get('/api/users/:id', (req, res) => {
  const query = 'SELECT id, fullname, username, age, bio, date_created, profilePic_link FROM users WHERE id = ?';
  connection.query(query, req.params.id, (err, response) => {
    if (err) throw err;
    res.json(response);
  });
})

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
