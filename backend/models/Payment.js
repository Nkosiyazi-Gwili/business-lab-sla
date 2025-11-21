import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  reference: {
    type: String,
    required: true,
    trim: true
  },
  method: {
    type: String,
    enum: ['eft', 'cash', 'credit_card', 'debit_order'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String,
  receiptUrl: String
}, {
  timestamps: true
});

export default mongoose.model('Payment', paymentSchema);