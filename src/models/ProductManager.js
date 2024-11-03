const fs = require('fs');
const path = require('path');
const productsFilePath = path.join(__dirname, '../data/products.json');

class ProductManager {
    getProducts() {
        return JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    }

    addProduct(product) {
        const products = this.getProducts();
        product.id = String(products.length + 1);
        products.push(product);
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
        return product;
    }

    deleteProduct(id) {
        let products = this.getProducts();
        products = products.filter(product => product.id !== id);
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    }
}

module.exports = new ProductManager();