// db.js
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'saliha12',
  database: 'massfashion_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = connection;
