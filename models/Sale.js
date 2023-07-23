const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SaleSchema = new Schema(
  {
    lead: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, "Product is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sale', SaleSchema);
