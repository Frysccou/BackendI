const express = require('express');
const app = express();
const productsRouter = require('./routes/products.routes');
const cartsRouter = require('./routes/carts.routes');

app.use(express.json());

// Rutitas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

module.exports = app;