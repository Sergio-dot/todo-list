const pool = require('../modules/db.module');

// Modello user
class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
}

module.exports = User;
