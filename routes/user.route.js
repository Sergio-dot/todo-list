const route = require('express').Router();
const item_controller = require('../controllers/item.controller');

route.get('/', item_controller.GetItems);
route.post('/add', item_controller.AddItem);
route.delete('/delete/:itemId', item_controller.DeleteItem);
route.post('/mark/:itemId', item_controller.MarkItem);
route.get('/edit/:itemId', item_controller.GetItemById);
route.post('/edit/:itemId', item_controller.UpdateItem);

module.exports = route;
