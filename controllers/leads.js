const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const Lead = require("../models/Lead");
const Record = require('../models/Record');

// @desc     Get all leads
// @route    GET -> "/api/v1/leads"
// @route    GET -> "/api/v1/leads?status=:status"
// @access   Private
exports.getLeads = asyncHandler(async (req, res, next) => {
  const {status} = req.query;
  if(status) {
    const leads = await Lead.find({status, user: req.user.id}).populate('records').populate('sales');
    return res.status(200).json({ success: true, count: leads.length, data: leads });
  }
  const leads = await Lead.find({user: req.user.id}).populate('records').populate('sales');
  res.status(200).json({ success: true, count: leads.length, data: leads });
});

// @desc     Create lead
// @route    POST -> "/api/v1/leads"
// @access   Private
exports.createLead = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const lead = await Lead.create(req.body);
  res.status(201).json({ success: true, data: lead });
});

// @desc     Get single lead
// @route    GET -> "/api/v1/leads/:id"
// @access   Private
exports.getLead = asyncHandler(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id).populate('records').populate('sales');
  if(!lead) return next(new ErrorResponse(`Lead not found with id of ${req.params.id}`, 404));
  res.status(200).json({ success: true, data: lead });
});

// @desc     Update lead
// @route    PUT -> "/api/v1/leads/:id"
// @access   Private
exports.updateLead = asyncHandler(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id);
  if(!lead) return next(new ErrorResponse(`Lead not found with id of ${req.params.id}`, 404));
  if(lead.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this lead`, 401));
  }
  await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ success: true, data: lead });
});

// @desc     Delete lead
// @route    DELETE -> "/api/v1/leads/:id"
// @access   Private
exports.deleteLead = asyncHandler(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id);
  if(!lead) return next(new ErrorResponse(`Lead not found with id of ${req.params.id}`, 404));
  if(lead.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this lead`, 401));
  }
  await Record.deleteMany({lead: lead.id});
  await Lead.findByIdAndRemove(req.params.id);
  res.status(200).json({ success: true, data: `Lead ${lead.name} deleted successfully` });
});
