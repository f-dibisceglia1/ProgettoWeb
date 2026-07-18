const express = require('express'); 
const router = express.Router()
const {
  createOrder,
  myOrders,
  listOrders,
  updateOrderStatus,
} = require('../controllers/order.controller.js');
const { requireAuth, requireAdmin } = require('../middleware/auth.js')



router.post('/', requireAuth, createOrder);


router.get('/mine', requireAuth, myOrders);


router.get('/', requireAuth, requireAdmin, listOrders);


router.put('/:id/status', requireAuth, requireAdmin, updateOrderStatus);

module.exports = router;
