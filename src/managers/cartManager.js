const fs = require('fs');
const path = require('path');
const cartsFilePath = path.join(__dirname, '../data/carts.json');

class CartManager {
    async createCart() {
        const carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));
        const newCart = { id: String(carts.length + 1), products: [] };
        carts.push(newCart);
        fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async getCartProducts(cartId) {
        const carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));
        const cart = carts.find(c => c.id === cartId);
        return cart ? cart.products : null;
    }

    async addProductToCart(cartId, productId) {
        const carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));
        const cart = carts.find(c => c.id === cartId);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(p => p.product === productId);
        if (productIndex === -1) {
            cart.products.push({ product: productId, quantity: 1 });
        } else {
            cart.products[productIndex].quantity += 1;
        }
        fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
        return cart;
    }
}

module.exports = new CartManager();