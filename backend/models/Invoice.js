import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  sla: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SLA',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  invoiceNumber: {
    type: String,
    unique: true,
    required: true
  },
  period: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  initiationFee: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: 'Monthly service fee'
  },
  lineItems: [{
    description: String,
    quantity: { type: Number, default: 1 },
    unitPrice: Number,
    amount: Number
  }],
  status: {
    type: String,
    enum: ['draft', 'sent', 'pending', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  sentAt: Date,
  paidAt: Date,
  paymentReference: String,
  paymentMethod: {
    type: String,
    enum: ['eft', 'cash', 'credit_card', 'debit_order', null],
    default: null
  },
  reminders: [{
    sentAt: Date,
    type: String, // '7_days', '3_days', '1_day', 'overdue'
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  notes: [{
    content: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Generate invoice number before saving
invoiceSchema.pre('save', function(next) {
  if (!this.invoiceNumber) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    this.invoiceNumber = `INV${timestamp}${random}`;
  }
  next();
});

// Calculate due date if not provided
invoiceSchema.pre('save', function(next) {
  if (!this.dueDate) {
    this.dueDate = new Date(this.issueDate);
    this.dueDate.setDate(this.dueDate.getDate() + 30);
  }
  next();
});

export default mongoose.model('Invoice', invoiceSchema);