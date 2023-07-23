const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const Sale = require('../models/Sale');

// @desc     Get all sales
// @route    GET -> "/api/v1/sales"
// @access   Private
exports.getSales = asyncHandler(async (req, res, next) => {
  const sales = await Sale.find({user: req.user.id}).populate({ path: 'lead', select: 'name' }).populate({path: 'product', select: 'title price'});
  res.status(200).json({ success: true, count: sales.length, data: sales });
});

// @desc     Create sale
// @route    POST -> "/api/v1/sales"
// @access   Private
exports.createSale = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const sale = await Sale.create(req.body);
  res.status(201).json({ success: true, data: sale });
});

// @desc     Get single sale
// @route    GET -> "/api/v1/sales/:id"
// @access   Private
exports.getSale = asyncHandler(async (req, res, next) => {
  const sale = await Sale.findById(req.params.id).populate({ path: 'lead', select: 'name' }).populate({path: 'product', select: 'title price'});
  if(!sale) return next(new ErrorResponse(`Sale not found with id of ${req.params.id}`, 404));
  res.status(200).json({ success: true, data: sale });
});

// @desc     Update sale
// @route    PUT -> "/api/v1/sales/:id"
// @access   Private
exports.updateSale = asyncHandler(async (req, res, next) => {
  const sale = await Sale.findById(req.params.id);
  if(!sale) return next(new ErrorResponse(`Sale not found with id of ${req.params.id}`, 404));
  if(sale.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this sale`, 401));
  }
  await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ success: true, data: sale });
});

// @desc     Delete sale
// @route    DELETE -> "/api/v1/sales/:id"
// @access   Private
exports.deleteSale = asyncHandler(async (req, res, next) => {
  const sale = await Sale.findById(req.params.id);
  if(!sale) return next(new ErrorResponse(`Sale not found with id of ${req.params.id}`, 404));
  if(sale.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this sale`, 401));
  }
  await Sale.findByIdAndRemove(req.params.id);
  res.status(200).json({ success: true, data: `Sale ${Sale.id} deleted successfully` });
});