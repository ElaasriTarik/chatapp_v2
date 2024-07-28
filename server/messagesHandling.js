const connection = require('./db_connection');

const sendMessage = (req, res) => {
  const { message, receiver, sender } = req.body;
  // console.log(message, receiver, sender);
  const data = {
    content: message,
    receiver_id: receiver,
    sender_id: sender,
    date_sent: moment.utc().add(1, 'hours').format()
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

module.exports = { sendMessage, getMessages, setMessagesAsSeen };
