const mongoose = require('mongoose');

const electricityPurchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ElectricityPurchase = mongoose.model('ElectricityPurchase', electricityPurchaseSchema);

module.exports = ElectricityPurchase;
