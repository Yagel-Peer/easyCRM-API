const mongoose = require('mongoose');
const Record = require('./Record');
const Schema = mongoose.Schema;

const LeadSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a name'],
    },
    email: {
      type: String,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
    },
    phone: {
      type: String,
    },
    marketing: {
      source: String,
      ad: String,
    },
    status: {
      type: String,
      enum: ['new', 'no reply', 'follow up', 'lost', 'invalid', 'close'],
      default: 'new',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// reverse populate with virtuals
LeadSchema.virtual('records', {
  ref: 'Record',
  localField: '_id',
  foreignField: 'lead',
  justOne: false,
});

LeadSchema.virtual('sales', {
  ref: 'Sale',
  localField: '_id',
  foreignField: 'lead',
  justOne: false,
});

module.exports = mongoose.model('Lead', LeadSchema);