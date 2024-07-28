const WebSocket = require('ws');
const connection = require('./db_connection');

function setupWebsocket(server, allowedOrigins) {

  // Verify clients' origin and decide whether to allow the connection
  const verifyClient = (info, done) => {
    const origin = info.origin;
    // Check if the origin is in the allowedOrigins list
    if (allowedOrigins.includes(origin)) {
      done(true); // Accept connection
    } else {
      console.log('Blocked origin:', origin);
      done(false, 401, 'Unauthorized'); // Reject connection
    }
  };

  const wss = new WebSocket.Server({ server, verifyClient });

  wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
      // console.log('received: %s', message);
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message);
        // console.log('parsedMessage', parsedMessage);
      } catch (e) {
        console.error('Error parsing message:', message, e);
        // Optionally, you can send a message back to the client indicating the error
        ws.send(JSON.stringify({ success: false, message: 'Invalid JSON format' }));
        return; // Stop further processing
      }


      // if user is typing
      // console.log(parsedMessage.action);
      if (parsedMessage.action === 'typing') {
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            const { receiver, sender } = parsedMessage;

            const data = {
              type: 'typing',
              receiver_id: parseInt(receiver),
              sender_id: parseInt(sender),
              isTyping: true
            }
            // console.log('data', data);
            client.send(JSON.stringify(data));
          }
        })
      }

      if (parsedMessage.action === 'sendMessage') {
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            const { content, receiver, sender } = parsedMessage.message;
            // console.log(content, receiver, sender);
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
        sendMessage_func(parsedMessage.message, ws);

      }
      // Pseudocode for server handling typing notification
    });

    ws.on('error', function error(err) {
      console.error('WebSocket error:', err);
    });

  });
}
const moment = require('moment-timezone');
function sendMessage_func(messageData, ws) {
  const { content, receiver, sender } = messageData;
  // console.log(messageData);
  // console.log(message, receiver, sender);
  const data = {
    content: content,
    receiver_id: parseInt(receiver),
    sender_id: parseInt(sender),
    date_sent: moment.utc().add(1, 'hours').format()
  }
  const query = 'INSERT INTO messages SET ?';
  connection.query(query, data, (err, response) => {
    if (err) throw err;
    ws.send(JSON.stringify({ success: true, message: 'Message sent' }));

  })
}

module.exports = setupWebsocket;
