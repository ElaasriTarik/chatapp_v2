const connection = require('./db_connection');
const moment = require('moment');


const sendMessage = (req, res) => {
  const { message, receiver, sender } = req.body;
  // const now = new Date();
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  console.log('Formatted Date:', now);

  const data = {
    content: message,
    receiver_id: receiver,
    sender_id: sender,
    date_sent: now, // Correct DATETIME format
    seen: 'unseen' // Default value
  };

  const query = 'INSERT INTO messages SET ?';

  connection.query(query, data, (err, response) => {
    if (err) throw err;
    res.json({
      success: true,
      message: 'Data received',
      data: message
    });
  })
}


// get messages
const getMessages = (req, res) => {
  const { receiver, sender } = req.body;
  const query = 'SELECT * FROM messages WHERE receiver_id = ? AND sender_id = ? OR receiver_id = ? AND sender_id = ? ORDER BY date_sent ASC';
  connection.query(query, [receiver, sender, sender, receiver], (err, response) => {
    if (err) throw err;
    // console.log(response);
    res.json(response);
  })
}


// set messages as seen when user open conversation
const setMessagesAsSeen = (req, res) => {
  const { receiver, sender } = req.body;
  const query = "UPDATE messages SET seen = 'seen' WHERE receiver_id = ? AND sender_id = ?";
  connection.query(query, [receiver, sender], (err, response) => {
    if (err) throw err;
    res.json({ success: true });
  });
}


// function to create a time
function formatDateForMySQL(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
module.exports = { sendMessage, getMessages, setMessagesAsSeen };
