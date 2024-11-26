const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

const createCart = async (req, res) => {
    try {
        const newCart = new Cart();
        await newCart.save();
        res.status(201).json(newCart);
    } catch {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
};

const getCartProducts = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
        res.json(cart.products.length ? cart.products : { message: 'El carrito está vacio' });
    } catch {
        res.status(500).json({ error: 'Error al obtener los productos del carrito' });
    }
};

const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity = 1 } = req.body;

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        const product = await Product.findById(pid);
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

        if (quantity <= 0) return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex === -1) {
            cart.products.push({ product: pid, quantity });
        } else {
            cart.products[productIndex].quantity += quantity;
        }

        await cart.save();
        const populatedCart = await cart.populate('products.product');
        res.json(populatedCart);
    } catch {
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
};

const deleteProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex !== -1) {
            cart.products.splice(productIndex, 1);
            await cart.save();
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }
    } catch {
        res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
};

const updateProductQuantityInCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        if (quantity <= 0) return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }
    } catch {
        res.status(500).json({ error: 'Error al actualizar el producto en el carrito' });
    }
};

module.exports = { createCart, getCartProducts, addProductToCart, deleteProductFromCart, updateProductQuantityInCart };