const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CheckoutSchema = new Schema({
  userId: {
    type: Schema.ObjectId,
    required: true
  },
  shipping: {},
  payment: {},
  products: [
    {
      productId: {
        type: Schema.ObjectId,
        required: true
      },
      qty: {
        type: Number,
        required: true
      },
      total: {
        type: Number,
        required: true
      }
    }
  ],
  status: {
    type: String,
    default: "active"
  },
  date: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date
  }
});

module.exports = mongoose.model("Checkout", CheckoutSchema);
