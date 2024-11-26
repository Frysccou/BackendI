const express = require('express');
const router = express.Router();
const productManager = require('../managers/ProductManager');

router.get('/', async (req, res) => {
    const products = await productManager.getProducts({ limit: 10, page: 1 });
    res.render('home', { products: products.payload });
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts({ limit: 10, page: 1 });
    res.render('realTimeProducts', { products: products.payload });
});

module.exports = router;