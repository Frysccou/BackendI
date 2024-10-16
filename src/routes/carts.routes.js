const express = require('express');
const router = express.Router();
const cartsController = require('../controllers/carts.controller');

// Crear un nuevo carrito (POST)
router.post('/', cartsController.createCart);

// Obtener un prodcuto de un carrito (GET con /:cid)
router.get('/:cid', cartsController.getCartProducts);

// Agregar un producto al carrito (POST con banda de cosas)
router.post('/:cid/product/:pid', cartsController.addProductToCart);

module.exports = router;