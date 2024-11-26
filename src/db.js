const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://fhrisco:12345@backend01.pohsy.mongodb.net/?retryWrites=true&w=majority');
    console.log('Conexion a la base de datos exitosamente exitosa');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
};

module.exports = connectDB;