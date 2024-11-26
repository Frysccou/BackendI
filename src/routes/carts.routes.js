const express = require('express');
const router = express.Router();
const cartsController = require('../controllers/cartsController');

router.post('/', cartsController.createCart);
router.get('/:cid', cartsController.getCartProducts);
router.post('/:cid/product/:pid', cartsController.addProductToCart);
router.put('/:cid/product/:pid', cartsController.updateProductQuantityInCart);
router.delete('/:cid/product/:pid', cartsController.deleteProductFromCart);

module.exports = router;