const fs = require('fs');
const path = require('path');
const productsFilePath = path.join(__dirname, '../data/products.json');

const getAllProducts = (req, res) => {
    const limit = req.query.limit;
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    if (limit) {
        return res.json(products.slice(0, limit));
    }
    res.json(products);
};

const getProductById = (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    const product = products.find(p => p.id === req.params.pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
};

const addProduct = (req, res) => {
    const { title, price } = req.body;
    if (!title || !price) {
        return res.status(400).json({ error: 'El título y el precio son obligatorios' });
    }

    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    const newProduct = {
        id: String(products.length + 1),
        title,
        description: '',
        code: '',
        price: parseFloat(price),
        status: true,
        stock: 0,
        category: '',
        thumbnails: []
    };

    products.push(newProduct);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
};

const updateProduct = (req, res) => {
    const { pid } = req.params;
    const updatedFields = req.body;

    let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    const productIndex = products.findIndex(p => p.id === pid);

    if (productIndex === -1) return res.status(404).json({ error: 'Producto no encontrado' });

    products[productIndex] = { ...products[productIndex], ...updatedFields, id: pid };
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.json(products[productIndex]);
};

const deleteProduct = (req, res) => {
    const { pid } = req.params;
    let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    products = products.filter(p => p.id !== pid);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.status(204).send();
};

module.exports = { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct };