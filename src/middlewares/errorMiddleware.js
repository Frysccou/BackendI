const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'ALgo salio mal, por favor intentelo nuevamente' });
  };
  
  module.exports = errorMiddleware;  