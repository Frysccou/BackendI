const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');

// Obtencion de todos los productos (GET)
router.get('/', productsController.getAllProducts);

// Obtencion de un producto por ID (GET con /:pid)
router.get('/:pid', productsController.getProductById);

// Agregar un nuevo producto (POST)
router.post('/', productsController.addProduct);

// Actualizar un producto (PUT con /:pid)
router.put('/:pid', productsController.updateProduct);

// Eliminar un producto (DElETE con /:pid)
router.delete('/:pid', productsController.deleteProduct);

module.exports = router;