const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const productsController = require('./controllers/productsController');
const fs = require('fs');
const path = require('path');
const productsFilePath = path.join(__dirname, './src/data/products.json');

const PORT = 8080;

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    socket.emit('updateProducts', JSON.parse(fs.readFileSync(productsFilePath, 'utf-8')));

    socket.on('newProduct', (productData) => {
        const req = { body: productData };
        const res = {
            status: (code) => ({
                json: (data) => {
                    if (data.error) {
                        socket.emit('error', data.error);
                    } else {
                        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
                        io.emit('updateProducts', products);
                    }
                }
            }),
        };

        productsController.addProduct(req, res);
    });

    socket.on('deleteProduct', (id) => {
        let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        products = products.filter(product => product.id !== id);
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
        io.emit('updateProducts', products);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(PORT, () => {
    console.log(`El server inicio en el puerto ${PORT}`);
});