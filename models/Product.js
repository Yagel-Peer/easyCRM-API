const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, 'Please enter a title'],
    },
    price: {
      type: Number,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
