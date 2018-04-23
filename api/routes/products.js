const express = require('express');
const mongoose = require('mongoose');
const upload = require('../middleware/multerMiddleware');

const router = express.Router();

const Product = require('../models/product');

router.get('/', (req, res, next) => {
	Product.find()
		.select('-__v')
		.exec()
		.then(result => {
			const products = result.map(doc => {
				return {
					...doc._doc,
					request: {
						type: 'GET',
						uri: `http://localhost:4000/products/${doc._id}`
					}
				}
			});
			res.status(200).json({ count: result.length, products })
		}).catch(err => {
			res.status(500).json({ error: err })
		})
});

router.post('/', upload.single('productImage'), (req, res, next) => {
	console.log(req.file);
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
		productImage: req.file.path
	});

	product.save().then(result => {
		res.status(201).json({ createdProduct: product })
	}).catch(err => {
		res.status(500).json({ error: err })
	})
});

router.get('/:productId', (req, res, next) => {
	const id = req.params.productId;
	Product.findById(id).exec().then(doc => {
		res.status(201).json(doc)
	}).catch(err => {
		res.status(500).json({ message: err })
	})
});

router.patch('/:productId', (req, res, next) => {
	const id = req.params.productId;
	const { product } = req.body;
	Product.update({ _id: id }, { $set: product })
		.exec()
		.then(result => {
			res.status(200).json(result)
		})
		.catch(err => {
			res.status(500).json({ error: err })
		})
});

router.delete('/:productId', (req, res, next) => {
	const id = req.params.productId;
	Product.remove({ _id: id })
		.exec()
		.then(result => {
			res.status(200).json(result)
		})
		.catch(err => {
			res.status(500).json({ error: err })
		})
});

module.exports = router;