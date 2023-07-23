const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const Product = require("../models/Product");

// @desc     Get all products
// @route    GET -> "/api/v1/products"
// @access   Private
exports.getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({user: req.user.id});
  res.status(200).json({ success: true, count: products.length, data: products });
});

// @desc     Create product
// @route    POST -> "/api/v1/products"
// @access   Private
exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

// @desc     Get single product
// @route    GET -> "/api/v1/products/:id"
// @access   Private
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if(!product) return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  res.status(200).json({ success: true, data: product });
});

// @desc     Update product
// @route    PUT -> "/api/v1/products/:id"
// @access   Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if(!product) return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  if(product.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this product`, 401));
  }
  await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ success: true, data: product });
});

// @desc     Delete product
// @route    DELETE -> "/api/v1/products/:id"
// @access   Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if(!product) return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  if(product.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this product`, 401));
  }
  await Product.findByIdAndRemove(req.params.id);
  res.status(200).json({ success: true, data: `Product ${product.title} deleted successfully` });
});