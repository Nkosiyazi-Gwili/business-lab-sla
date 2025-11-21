import mongoose from 'mongoose';

const serviceStatusSchema = new mongoose.Schema({
  selected: { type: Boolean, default: false },
  staffCompliment: String,
  initiationFee: { type: Number, default: 0 },
  monthlyFee: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  lastUpdated: { type: Date, default: Date.now },
  notes: [{
    content: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }]
});

const slaSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  slaNumber: {
    type: String,
    unique: true,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    default: 24
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  services: {
    skillsDevelopment: serviceStatusSchema,
    employmentEquity: serviceStatusSchema,
    bbbee: serviceStatusSchema,
    package: {
      type: {
        type: String,
        enum: ['silver', 'gold', 'platinum', null],
        default: null
      },
      staffCompliment: String,
      initiationFee: { type: Number, default: 0 },
      monthlyFee: { type: Number, default: 0 },
      status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'cancelled'],
        default: 'pending'
      },
      progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      includedServices: [String],
      lastUpdated: { type: Date, default: Date.now }
    }
  },
  totalMonthlyFee: {
    type: Number,
    default: 0
  },
  totalInitiationFee: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'active', 'expired', 'cancelled', 'terminated'],
    default: 'draft'
  },
  signedAt: Date,
  signedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancellationNotice: {
    requested: { type: Boolean, default: false },
    requestedAt: Date,
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: String,
    processed: { type: Boolean, default: false },
    processedAt: Date,
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  renewalHistory: [{
    renewedAt: Date,
    previousEndDate: Date,
    newEndDate: Date,
    escalatedAmount: Number
  }],
  serviceLogs: [{
    service: String,
    action: String,
    description: String,
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    performedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Generate SLA number before saving
slaSchema.pre('save', function(next) {
  if (!this.slaNumber) {
    this.slaNumber = `SLA${Date.now().toString().slice(-6)}`;
  }
  next();
});

// Calculate total fees before saving
slaSchema.pre('save', function(next) {
  let totalMonthly = 0;
  let totalInitiation = 0;

  if (this.services.skillsDevelopment.selected) {
    totalMonthly += this.services.skillsDevelopment.monthlyFee || 0;
    totalInitiation += this.services.skillsDevelopment.initiationFee || 0;
  }

  if (this.services.employmentEquity.selected) {
    totalMonthly += this.services.employmentEquity.monthlyFee || 0;
    totalInitiation += this.services.employmentEquity.initiationFee || 0;
  }

  if (this.services.bbbee.selected) {
    totalMonthly += this.services.bbbee.monthlyFee || 0;
    totalInitiation += this.services.bbbee.initiationFee || 0;
  }

  if (this.services.package.type) {
    totalMonthly += this.services.package.monthlyFee || 0;
    totalInitiation += this.services.package.initiationFee || 0;
  }

  this.totalMonthlyFee = totalMonthly;
  this.totalInitiationFee = totalInitiation;
  next();
});

export default mongoose.model('SLA', slaSchema);