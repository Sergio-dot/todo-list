//Modules
require('dotenv').config();
const express = require('express');
const path = require('path');

const port = process.env.SERVER_PORT || 3000;

// Init express
const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
const user_routes = require('../routes/user.route');

app.use('/v1/user', user_routes);

app.get('/', (req, res) => {
  res.redirect('/v1/user/');
});

// Start web server
app.listen(port, () => {
  console.log(` [*] Server listening at port ${process.env.SERVER_PORT}`);
});
