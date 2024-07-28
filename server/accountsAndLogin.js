// this file includes anything related to accounts and login (registering, logging in, logging out, updating profile, deleting account)

const connection = require('./db_connection');

// creating account
const createAccount = (req, res) => {
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
      // generate a random user profile
      data.profilePic_link = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${data.username}`;
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
}

//login
const login = (req, res) => {
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
      // console.log(res);
    } else {
      console.log('Login failed');
      res.json({
        success: false,
        message: 'incorrect username or password',
      });
    }
  });

}

module.exports = {
  createAccount,
  login
}
