const connection = require('./db_connection');


// fettch all users
const suggestions = (req, res) => {
  const { user_id } = req.body;
  const query = `
    SELECT id, username, fullname, date_created, bio, profilePic_link 
    FROM users 
    WHERE id != ? 
    AND id NOT IN (
      SELECT CASE 
        WHEN user_id1 = ? THEN user_id2 
        WHEN user_id2 = ? THEN user_id1 
      END 
      FROM friends 
      WHERE (user_id1 = ? OR user_id2 = ?) 
      AND status = 'accepted'
    )
  `;

  connection.query(query, [user_id, user_id, user_id, user_id, user_id], (err, response) => {
    if (err) {
      throw err;
    };

    res.json(response);
  });
}

// handling invites
const inviting = (req, res) => {
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
      const insertQuery = "INSERT INTO friends(user_id1, user_id2, inviter_name, recepient_name, date_sent, date_accepted, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')";
      connection.query(insertQuery, [inviterId, recepientId, inviter_name, recepient_name, new Date(), new Date()], (insertErr, insertResult) => {
        if (insertErr) {
          console.error('Error inserting invite:', insertErr);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        console.log('Invite sent');
        res.json({ success: true, message: 'Invite sent' });
      });
    }
  });
}

// checking for any invites for a certain user

const checkforInvites = (req, res) => {
  const { inviterId } = req.body
  // console.log(inviterId);
  const checkInvites = `
  SELECT friends.*, users.profilePic_link
    FROM friends 
    JOIN users ON friends.user_id1 = users.id 
    WHERE friends.user_id2 = ? AND friends.status = 'pending'`;
  connection.query(checkInvites, inviterId, (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      res.json({ success: true, result: result })
    }
  })
}

// delete a request
const delete_request = (req, res) => {
  const { user_id1, user_id2 } = req.body
  console.log(user_id1, user_id2);

  const query = "DELETE FROM friends WHERE user_id1 = ? AND user_id2 = ? AND status = 'pending'";
  connection.query(query, [user_id1, user_id2], (err, response) => {
    if (err) throw err;

    res.json({ success: true });
  })
}

// accept request
const accept_request = (req, res) => {
  const { user_id1, user_id2 } = req.body;
  console.log(user_id1, user_id2);
  const query = "UPDATE friends SET status = 'accepted', date_accepted = ? WHERE user_id1 = ? AND user_id2 = ?";
  connection.query(query, [new Date(), user_id1, user_id2], (err, response) => {
    if (err) throw err;
    res.json({ success: true });
  })
}

// fetch all my friends
const getMyFriends = (req, res) => {
  const { user_id } = req.body;
  // const query = 'SELECT * FROM friends WHERE (user_id1 = ? OR user_id2 = ?) AND status = "accepted"';
  const query = `
        SELECT 
            f.user_id1, 
            f.user_id2, 
            f.recepient_name, 
            f.inviter_name,
            u1.profilePic_link AS inviter_profilePic_link,
            u2.profilePic_link AS recepient_profilePic_link,
            m.content,
            m.date_sent,
            m.sender_id,
            m.receiver_id
        FROM 
            friends f
        LEFT JOIN 
            messages m 
        ON 
            (f.user_id1 = m.sender_id AND f.user_id2 = m.receiver_id) 
            OR 
            (f.user_id1 = m.receiver_id AND f.user_id2 = m.sender_id)
        LEFT JOIN 
            users u1 
        ON 
            f.user_id1 = u1.id
        LEFT JOIN 
            users u2 
        ON 
            f.user_id2 = u2.id
        WHERE 
            (f.user_id1 = ? OR f.user_id2 = ?) 

        ORDER BY 
            m.date_sent DESC
    `;
  connection.query(query, [parseInt(user_id), parseInt(user_id)], (err, response) => {
    if (err) throw err;


    const friendsMap = new Map();
    response.forEach(row => {
      const friend_id = row.user_id1 == user_id ? row.user_id2 : row.user_id1;
      if (!friendsMap.has(friend_id)) {
        friendsMap.set(friend_id, {
          friend_fullname: row.user_id1 == user_id ? row.recepient_name : row.inviter_name,
          recepient_name: row.recepient_name,
          inviter_name: row.inviter_name,
          friend_id: friend_id,
          last_message: row.content,
          last_message_timestamp: row.date_sent,
          last_message_sender_id: row.sender_id,
          last_message_receiver_id: row.receiver_id,
          profilePic_link: row.inviter_profilePic_link
        });
      }
    });
    const friendsList = Array.from(friendsMap.values());
    // console.log(friendsList);
    res.json(friendsList);
  });
}

// get a user by id
const getUserById = (req, res) => {
  const { user_id } = req.body;
  const query = 'SELECT * FROM users WHERE id = ?';
  connection.query(query, user_id, (err, response) => {
    if (err) throw err;

    res.json(response);
  });
}

module.exports = { suggestions, inviting, checkforInvites, delete_request, accept_request, getMyFriends, getUserById };
