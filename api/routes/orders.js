const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

const router = express.Router();


router.get('/', (req, res, next) => {
    Order.find()
        .exec()
        .then(docs => {
            res.status(200).json(docs)
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
});

router.post('/', (req, res, next) => {
    const id = req.body.productId;
    Product.findById(id).exec()
        .then(() => {
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: id
            });
            return order.save()
        })
        .then(result => {
            res.status(200).json(result)
        }).catch(err => {
            res.status(500).json(err)
        })
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id).exec()
        .then(result => {
            res.status(200).json(result)
        }).catch(err => {
            res.status(500).json({ error: err })
        })
});

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.remove({ _id: id }).exec()
        .then(() => {
            res.status(200).json({ message: 'Orders deleted' })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
});

module.exports = router;