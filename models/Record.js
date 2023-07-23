const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecordSchema = new Schema(
  {
    lead: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"]
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Record', RecordSchema);

