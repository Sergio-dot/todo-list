const route = require('express').Router();
const auth_middleware = require('../middlewares/auth.middleware');

route.get('/dashboard', auth_middleware.verifyToken, (req, res) => {
  return res
    .status(200)
    .json({ status: true, message: 'This is your dashboard' });
});

module.exports = route;
