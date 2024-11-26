const fs = require('fs');
const path = require('path');
const productsFilePath = path.join(__dirname, '../data/products.json');

class ProductManager {
    async getProducts({ limit, page, sort, query }) {
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        let filteredProducts = products;

        if (query) filteredProducts = filteredProducts.filter(p => p.category === query || p.status.toString() === query);

        if (sort) filteredProducts.sort((a, b) => (sort === 'asc' ? a.price - b.price : b.price - a.price));

        const totalPages = Math.ceil(filteredProducts.length / limit);
        const startIndex = (page - 1) * limit;
        const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

        return {
            status: 'success',
            payload: paginatedProducts,
            totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort || ''}&query=${query || ''}` : null,
            nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort || ''}&query=${query || ''}` : null,
        };
    }

    async getProductById(id) {
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        return products.find(product => product.id === id) || null;
    }

    async addProduct(productData) {
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        const newProduct = { id: String(products.length + 1), ...productData };
        products.push(newProduct);
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async updateProduct(id, updatedData) {
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        const productIndex = products.findIndex(product => product.id === id);
        if (productIndex === -1) return null;

        products[productIndex] = { ...products[productIndex], ...updatedData };
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
        return products[productIndex];
    }

    async deleteProduct(id) {
        let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        const initialLength = products.length;
        products = products.filter(product => product.id !== id);
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
        return products.length < initialLength;
    }
}

module.exports = new ProductManager();