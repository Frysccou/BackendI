const Product = require('../models/product.model');

const getAllProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const queryFilter = query ? { category: query } : {};
        const sortOrder = sort === 'desc' ? -1 : 1;

        const products = await Product.find(queryFilter)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort(sort ? { price: sortOrder } : {});

        const totalProducts = await Product.countDocuments(queryFilter);
        const totalPages = Math.ceil(totalProducts / limit);

        res.json({
            status: 'success',
            products,
            totalPages,
            currentPage: page,
        });
    } catch {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(product);
    } catch {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

const addProduct = async (req, res) => {
    try {
        const { title, price, code, description = '', status = true, stock = 0, category = '', thumbnails = [] } = req.body;

        if (!title || !price || !code) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: title, price, code' });
        }

        if (!Array.isArray(thumbnails)) {
            return res.status(400).json({ error: 'Thumbnails debe ser un array de strings' });
        }

        const existingProduct = await Product.findOne({ code });
        if (existingProduct) {
            return res.status(400).json({ error: 'El codigo ya existe jaja' });
        }

        const newProduct = new Product({
            title,
            price,
            code,
            description,
            status,
            stock,
            category,
            thumbnails,
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch {
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(updatedProduct);
    } catch {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
        if (!deletedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
        res.status(204).send();
    } catch {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

module.exports = { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct };