import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true
  },
  fileReference: {
    type: String,
    unique: true,
    sparse: true
  },
  contactPerson: {
    type: String,
    required: [true, 'Contact person is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    physical: {
      street: String,
      city: String,
      province: String,
      postalCode: String
    },
    postal: {
      street: String,
      city: String,
      province: String,
      postalCode: String
    }
  },
  staffCompliment: {
    type: Number,
    required: [true, 'Staff compliment is required'],
    min: [1, 'Staff compliment must be at least 1']
  },
  industry: {
    type: String,
    trim: true
  },
  documents: {
    certifiedCompanyDocs: { type: Boolean, default: false },
    certifiedDirectors: { type: Boolean, default: false },
    bbbeeScorecard: { type: Boolean, default: false },
    companyLetterhead: { type: Boolean, default: false },
    vatRegistration: { type: Boolean, default: false },
    bankingDetails: { type: Boolean, default: false },
    taxClearance: { type: Boolean, default: false },
    csdRegistration: { type: Boolean, default: false },
    uploadedDocuments: [{
      name: String,
      type: String,
      url: String,
      uploadedAt: { type: Date, default: Date.now }
    }]
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'terminated'],
    default: 'pending'
  },
  notes: [{
    content: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Generate file reference before saving
clientSchema.pre('save', function(next) {
  if (!this.fileReference) {
    this.fileReference = `BL${Date.now().toString().slice(-6)}`;
  }
  next();
});

export default mongoose.model('Client', clientSchema);