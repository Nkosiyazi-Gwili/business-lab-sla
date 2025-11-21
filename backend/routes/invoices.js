import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import Invoice from '../models/Invoice.js';
import Payment from '../models/Payment.js';
import SLA from '../models/SLA.js';

const router = express.Router();

// Get all invoices
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, client } = req.query;
    
    let query = {};
    if (status) query.status = status;
    
    // Clients can only see their own invoices
    if (req.user.role === 'client') {
      query.client = req.user.company;
    } else if (client) {
      query.client = client;
    }

    const invoices = await Invoice.find(query)
      .populate('client')
      .populate('sla')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Invoice.countDocuments(query);

    res.json({
      invoices,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get invoice by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('client')
      .populate('sla');
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Check access
    if (req.user.role === 'client' && req.user.company.toString() !== invoice.client._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Record payment
router.post('/:id/payment', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { amount, reference, method, paymentDate } = req.body;
    
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const payment = new Payment({
      invoice: invoice._id,
      client: invoice.client,
      amount,
      reference,
      method,
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      status: 'completed',
      processedBy: req.user._id
    });
    await payment.save();

    invoice.status = 'paid';
    invoice.paidAt = new Date();
    invoice.paymentReference = reference;
    invoice.paymentMethod = method;
    await invoice.save();

    res.json({ invoice, payment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Generate monthly invoices (admin only)
router.post('/generate-monthly', authenticate, authorize('admin'), async (req, res) => {
  try {
    const activeSLAs = await SLA.find({ status: 'active' }).populate('client');
    const generatedInvoices = [];

    for (const sla of activeSLAs) {
      if (sla.totalMonthlyFee > 0) {
        const invoice = await createInvoice(
          sla,
          sla.client,
          sla.totalMonthlyFee,
          false,
          'Monthly Service Fee'
        );
        generatedInvoices.push(invoice);
      }
    }

    res.json({
      message: `Generated ${generatedInvoices.length} monthly invoices`,
      invoices: generatedInvoices
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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