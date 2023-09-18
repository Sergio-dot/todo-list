require('dotenv').config();
const mdb = require('mariadb');

const pool = mdb.createPool({
  host: 'db',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

async function initDatabase() {
  let conn;
  try {
    conn = await pool.getConnection();

    // Create database
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DATABASE}\``
    );

    console.log(' [-] Configuring database...');

    await conn.query(`USE \`${process.env.MYSQL_DATABASE}\``);

    console.log(' [*] Database configured');

    console.log(' [-] Configuring tables...');
    // Create tables
    await conn.query(`CREATE TABLE IF NOT EXISTS \`user\` (
      \`id\` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      \`username\` VARCHAR(255) NOT NULL UNIQUE,
      \`password\` VARCHAR(255) NOT NULL
    )`);
    await conn.query(`CREATE TABLE IF NOT EXISTS \`item\` (
      \`id\` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      \`title\` VARCHAR(255) NOT NULL,
      \`description\` VARCHAR(255),
      \`completed\` TINYINT(1) NOT NULL DEFAULT 0
    )`);
    console.log(' [*] Tables configured');
  } catch (err) {
    console.error('Database initialization error: ', err);
  } finally {
    if (conn) {
      conn.end();
    }
  }
}

initDatabase();

module.exports = {
  getConnection: function () {
    return new Promise(function (resolve, reject) {
      pool
        .getConnection()
        .then(function (connection) {
          resolve(connection);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  },
};
