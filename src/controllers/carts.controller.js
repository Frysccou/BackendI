const fs = require('fs');
const path = require('path');
const cartsFilePath = path.join(__dirname, '../data/carts.json');

const createCart = (req, res) => {
    const carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));
    const newCart = {
        id: String(carts.length + 1),
        products: []
    };
    carts.push(newCart);
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
    res.status(201).json(newCart);
};

const getCartProducts = (req, res) => {
    const { cid } = req.params;
    const carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));
    const cart = carts.find(c => c.id === cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart.products);
};

const addProductToCart = (req, res) => {
    const { cid, pid } = req.params;
    const carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));
    const cart = carts.find(c => c.id === cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const productIndex = cart.products.findIndex(p => p.product === pid);
    if (productIndex === -1) {
        cart.products.push({ product: pid, quantity: 1 });
    } else {
        cart.products[productIndex].quantity += 1;
    }

    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
    res.json(cart);
};

module.exports = { createCart, getCartProducts, addProductToCart };