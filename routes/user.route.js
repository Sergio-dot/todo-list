const route = require('express').Router();
const auth_middleware = require('../middlewares/auth.middleware');
const item_controller = require('../controllers/item.controller');

route.get('/dashboard', auth_middleware.verifyToken, (req, res) => {
  return res
    .status(200)
    .json({ status: true, message: 'This is your dashboard' });
});

route.get('/', item_controller.GetItems);
route.post('/add', item_controller.AddItem);

module.exports = route;
