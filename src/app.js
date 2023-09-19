//Modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const port = process.env.SERVER_PORT || 3000;

console.log(' -> ', process.env.SERVER_PORT);
console.log(' -> ', process.env.MYSQL_HOST);
console.log(' -> ', process.env.MYSQL_ROOT_PASSWORD);
console.log(' -> ', process.env.MYSQL_DATABASE);
console.log(' -> ', process.env.MYSQL_USER);
console.log(' -> ', process.env.MYSQL_PASSWORD);
console.log(' -> ', process.env.REDIS_URL);
console.log(' -> ', process.env.RABBITMQ_URL);

// Init express
const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
const auth_routes = require('../routes/auth.route');
const user_routes = require('../routes/user.route');

app.use('/v1/auth', auth_routes);
app.use('/v1/user', user_routes);

app.get('/', (req, res) => {
  res.redirect('/v1/user/');
});

// Start web server
app.listen(port, () => {
  console.log(` [*] Server listening at port ${process.env.SERVER_PORT}`);
});
