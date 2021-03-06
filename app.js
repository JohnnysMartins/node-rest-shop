const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect(`mongodb+srv://johnnys-martins:${process.env.DB_PASSWORD}@node-rest-shop-ctmrw.mongodb.net/test`);

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-with, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        req.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
        res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: { message: error.message }
    })
});

module.exports = app;