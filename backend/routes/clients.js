import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import Client from '../models/Client.js';
import SLA from '../models/SLA.js';
import Invoice from '../models/Invoice.js';

const router = express.Router();

// Get all clients (admin only)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) {
      query.status = status;
    }

    const clients = await Client.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Client.countDocuments(query);

    res.json({
      clients,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get client by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    // Clients can only access their own data, admins can access all
    if (req.user.role === 'client' && req.user.company.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update client documents
router.patch('/:id/documents', authenticate, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Clients can only update their own documents
    if (req.user.role === 'client' && req.user.company.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { $set: { documents: req.body } },
      { new: true, runValidators: true }
    );
    res.json(updatedClient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get client dashboard data
router.get('/:id/dashboard', authenticate, async (req, res) => {
  try {
    const clientId = req.params.id;
    
    // Check access
    if (req.user.role === 'client' && req.user.company.toString() !== clientId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const [activeSLA, pendingInvoices, recentInvoices, client] = await Promise.all([
      SLA.findOne({ client: clientId, status: 'active' }),
      Invoice.find({ client: clientId, status: 'pending' }),
      Invoice.find({ client: clientId })
        .sort({ createdAt: -1 })
        .limit(5),
      Client.findById(clientId)
    ]);

    res.json({
      activeSLA,
      pendingInvoices: pendingInvoices.length,
      recentInvoices,
      documentCompletion: calculateDocumentCompletion(client.documents)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function calculateDocumentCompletion(documents) {
  if (!documents) return 0;
  const totalDocs = Object.keys(documents).length - 1; // Exclude uploadedDocuments array
  const completedDocs = Object.values(documents)
    .filter(value => typeof value === 'boolean' && value === true).length;
  return Math.round((completedDocs / totalDocs) * 100);
}

export default router;