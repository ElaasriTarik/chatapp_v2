// connect to db
const mysql = require('mysql2');
const { connect } = require('http2');
const { resourceLimits } = require('worker_threads');
const { escape } = require('querystring');

const loginAdmin = process.env.LOGINAADMIN;
const password = process.env.PASSWORD;
const host = process.env.HOST;

const connection = mysql.createConnection({
  host: host,
  user: 'avnadmin',
  password: password,
  database: 'defaultdb',
  port: process.env.PORT,
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

module.exports = connection;