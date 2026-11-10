const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.get('/', authenticate, cartController.getCart);
router.post('/add', authenticate, cartController.addToCart);
router.put('/update', authenticate, cartController.updateCartItem);
router.put('/sync', authenticate, cartController.syncCart);
router.delete('/remove/:cartItemId', authenticate, cartController.removeFromCart);
router.delete('/clear', authenticate, cartController.clearCart);

module.exports = router;

