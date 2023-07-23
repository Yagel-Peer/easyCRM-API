const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const Record = require('../models/Record');
const Lead = require('../models/Lead');

// @desc     Get all records
// @route    GET -> "/api/v1/records"
// @route    GET -> "/api/v1/leads/:leadId/records"
// @access   Private
exports.getRecords = asyncHandler(async (req, res, next) => {
  console.log(req.params);
  if (req.params.leadId) {
    console.log('Getting records for a single lead');
    const records = await Record.find({ lead: req.params.leadId }).populate({ path: 'lead', select: 'name' });
    return res.status(200).json({ success: true, count: records.length, data: records });
  }
  const records = await Record.find().populate({ path: 'lead', select: 'name' });
  res.status(200).json({ success: true, count: records.length, data: records });
});

// @desc     Get single record
// @route    GET -> "/api/v1/records/:id"
// @access   Private
exports.getRecord = asyncHandler(async (req, res, next) => {
  const record = await Record.findById(req.params.id).populate({path: 'lead',select: 'name'});
  if(!record) return next(new ErrorResponse(`Record not found with id of ${req.params.id}`, 404));
  res.status(200).json({ success: true, data: record });
});

// @desc     Create record
// @route    POST -> "/api/v1/leads/:leadId/records"
// @access   Private
exports.createRecord = asyncHandler(async (req, res, next) => {
  req.body.lead = req.params.leadId;
  const lead = await Lead.findById(req.params.leadId);
  if(!lead) return next(new ErrorResponse(`Lead not found with id of ${req.params.leadId}`, 404));
  const record = await Record.create(req.body);
  res.status(200).json({ success: true, data: record });
});

// @desc     Update record
// @route    PUT -> "/api/v1/records/:id"
// @access   Private
exports.updateRecord = asyncHandler(async (req, res, next) => {
  const record = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if(!record) return next(new ErrorResponse(`Record not found with id of ${req.params.id}`, 404));
  res.status(200).json({ success: true, data: record });
});

// @desc     Delete record
// @route    DELETE -> "/api/v1/records/:id"
// @access   Private
exports.deleteRecord = asyncHandler(async (req, res, next) => {
  const record = await Record.findByIdAndRemove(req.params.id);
  if(!record) return next(new ErrorResponse(`Record not found with id of ${req.params.id}`, 404));
  res.status(200).json({ success: true, data: `Record ${record.id} deleted successfully` });
});