//Modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('../modules/db.module');
const User = require('../models/user.model');

const port = process.env.SERVER_PORT || 4001;

// Init express
const app = express();

// View engine
app.set('view engine', 'ejs');

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
const auth_routes = require('../routes/auth.route');
const user_routes = require('../routes/user.route');

app.use('/v1/auth', auth_routes);
app.use('/v1/user', user_routes);

// Start web server
app.listen(port, () => {
  console.log(` [*] Server listening at port ${process.env.SERVER_PORT}`);
});
