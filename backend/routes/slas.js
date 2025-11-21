import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import SLA from '../models/SLA.js';
import Client from '../models/Client.js';
import Invoice from '../models/Invoice.js';

const router = express.Router();

const PRICING = {
  skillsDevelopment: {
    '1-20': { initiation: 2500, monthly: 1250 },
    '21-50': { initiation: 3000, monthly: 1500 },
    '51-100': { initiation: 3500, monthly: 1800 },
    '101-250': { initiation: 4000, monthly: 2160 },
    '251-500': { initiation: 4500, monthly: 2592 },
    '501-750': { initiation: 5000, monthly: 3110 }
  },
  employmentEquity: {
    '1-20': { initiation: 3500, monthly: 1850 },
    '21-50': { initiation: 4200, monthly: 2220 },
    '51-100': { initiation: 5040, monthly: 2664 },
    '101-250': { initiation: 6048, monthly: 3197 },
    '251-500': { initiation: 7258, monthly: 3836 },
    '501-750': { initiation: 8710, monthly: 4603 }
  },
  bbbee: {
    '0-10': { initiation: 3000, monthly: 5000 },
    '11-20': { initiation: 3000, monthly: 7500 },
    '21-30': { initiation: 3000, monthly: 11250 },
    '31-40': { initiation: 3000, monthly: 16875 },
    '41-50': { initiation: 0, monthly: 0 }
  },
  packages: {
    silver: {
      '1-20': { initiation: 3000, monthly: 2170 },
      '21-50': { initiation: 3600, monthly: 2604 },
      '51-100': { initiation: 4320, monthly: 3125 },
      '101-250': { initiation: 5184, monthly: 3750 },
      '251-500': { initiation: 6221, monthly: 4410 },
      '501-750': { initiation: 7465, monthly: 0 }
    },
    gold: {
      '1-20': { initiation: 4000, monthly: 3000 },
      '21-50': { initiation: 4800, monthly: 3600 },
      '51-100': { initiation: 5760, monthly: 4320 },
      '101-250': { initiation: 6912, monthly: 5184 },
      '251-500': { initiation: 8294, monthly: 6221 },
      '501-750': { initiation: 9953, monthly: 0 }
    },
    platinum: {
      '1-20': { initiation: 5000, monthly: 4000 },
      '21-50': { initiation: 6000, monthly: 4800 },
      '51-100': { initiation: 7200, monthly: 5760 },
      '101-250': { initiation: 8640, monthly: 6912 },
      '251-500': { initiation: 10368, monthly: 8294 },
      '501-750': { initiation: 12442, monthly: 0 }
    }
  }
};

// Create new SLA
router.post('/', authenticate, async (req, res) => {
  try {
    const { clientId, services, packageType } = req.body;
    
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Check access
    if (req.user.role === 'client' && req.user.company.toString() !== clientId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const staffRange = getStaffRange(client.staffCompliment);
    const bbbeeStaffRange = getBBBEEStaffRange(client.staffCompliment);

    const servicesWithPricing = {
      skillsDevelopment: services.skillsDevelopment ? {
        selected: true,
        staffCompliment: staffRange,
        ...PRICING.skillsDevelopment[staffRange],
        status: 'pending'
      } : { selected: false },
      
      employmentEquity: services.employmentEquity ? {
        selected: true,
        staffCompliment: staffRange,
        ...PRICING.employmentEquity[staffRange],
        status: 'pending'
      } : { selected: false },
      
      bbbee: services.bbbee ? {
        selected: true,
        staffCompliment: bbbeeStaffRange,
        ...PRICING.bbbee[bbbeeStaffRange],
        status: 'pending'
      } : { selected: false },
      
      package: packageType ? {
        type: packageType,
        staffCompliment: staffRange,
        ...PRICING.packages[packageType][staffRange],
        status: 'pending',
        includedServices: getPackageServices(packageType)
      } : { type: null }
    };

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 24);

    const sla = new SLA({
      client: clientId,
      startDate,
      endDate,
      services: servicesWithPricing,
      status: 'pending'
    });

    await sla.save();

    if (sla.totalInitiationFee > 0) {
      await createInvoice(sla, client, sla.totalInitiationFee, true, 'Initiation Fee');
    }

    res.status(201).json(sla);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all SLAs
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, client } = req.query;
    
    let query = {};
    if (status) query.status = status;
    
    // Clients can only see their own SLAs
    if (req.user.role === 'client') {
      query.client = req.user.company;
    } else if (client) {
      query.client = client;
    }

    const slas = await SLA.find(query)
      .populate('client')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SLA.countDocuments(query);

    res.json({
      slas,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get SLA by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const sla = await SLA.findById(req.params.id).populate('client');
    if (!sla) {
      return res.status(404).json({ message: 'SLA not found' });
    }

    // Check access
    if (req.user.role === 'client' && req.user.company.toString() !== sla.client._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(sla);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sign SLA
router.patch('/:id/sign', authenticate, authorize('admin'), async (req, res) => {
  try {
    const sla = await SLA.findByIdAndUpdate(
      req.params.id,
      {
        status: 'active',
        signedAt: new Date(),
        signedBy: req.user._id
      },
      { new: true }
    ).populate('client');

    await createInvoice(sla, sla.client, sla.totalMonthlyFee, false, 'Monthly Service Fee');

    res.json(sla);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Request cancellation
router.patch('/:id/cancel', authenticate, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const sla = await SLA.findById(req.params.id);
    if (!sla) {
      return res.status(404).json({ message: 'SLA not found' });
    }

    // Check access
    if (req.user.role === 'client' && req.user.company.toString() !== sla.client.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedSLA = await SLA.findByIdAndUpdate(
      req.params.id,
      {
        'cancellationNotice.requested': true,
        'cancellationNotice.requestedAt': new Date(),
        'cancellationNotice.requestedBy': req.user._id,
        'cancellationNotice.reason': reason
      },
      { new: true }
    );
    
    res.json(updatedSLA);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Helper functions
function getStaffRange(staffCount) {
  if (staffCount <= 20) return '1-20';
  if (staffCount <= 50) return '21-50';
  if (staffCount <= 100) return '51-100';
  if (staffCount <= 250) return '101-250';
  if (staffCount <= 500) return '251-500';
  return '501-750';
}

function getBBBEEStaffRange(staffCount) {
  if (staffCount <= 10) return '0-10';
  if (staffCount <= 20) return '11-20';
  if (staffCount <= 30) return '21-30';
  if (staffCount <= 40) return '31-40';
  return '41-50';
}

function getPackageServices(packageType) {
  const packages = {
    silver: ['Skills Development', 'EE Report and Submission'],
    gold: ['Skills Development', 'Employment Equity', 'HR/IR Support', 'File Preparation'],
    platinum: ['Skills Development', 'Employment Equity', 'IT Support', 'HR/IR', 'Occupational Health and Safety']
  };
  return packages[packageType] || [];
}

async function createInvoice(sla, client, amount, isInitiation = false, description = 'Service Fee') {
  const invoice = new Invoice({
    sla: sla._id,
    client: client._id,
    period: isInitiation ? 'Initiation' : new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    amount,
    initiationFee: isInitiation,
    description,
    status: 'sent'
  });

  await invoice.save();
  return invoice;
}

export default router;