import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Client from '../models/Client.js';
import SLA from '../models/SLA.js';
import Invoice from '../models/Invoice.js';
import Payment from '../models/Payment.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/businesslab';

// Sample data arrays
const COMPANY_NAMES = [
  'Tech Innovations Ltd', 'Global Solutions Inc', 'Future Enterprises', 'Smart Systems Co',
  'Digital Transformers', 'Innovation Hub SA', 'NextGen Technologies', 'Advanced Systems Ltd',
  'Creative Solutions', 'Modern Business Group', 'Elite Services Co', 'Prime Solutions Ltd',
  'Strategic Partners Inc', 'Visionary Enterprises', 'Progress Systems Co',
  'Dynamic Solutions Ltd', 'Tech Pioneers Co', 'Business Innovators', 'Corporate Solutions',
  'Enterprise Partners', 'Growth Systems Ltd', 'Success Ventures', 'Professional Services Co'
];

const INDUSTRIES = [
  'Technology', 'Consulting', 'Manufacturing', 'Healthcare', 'Finance',
  'Retail', 'Construction', 'Education', 'Transportation', 'Energy'
];

const CONTACT_PERSONS = [
  'John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson',
  'Lisa Anderson', 'Robert Taylor', 'Jennifer Martinez', 'Thomas Clark', 'Susan White',
  'Daniel Lee', 'Karen Harris', 'Christopher Martin', 'Nancy Thompson', 'Mark Garcia',
  'Jessica Rodriguez', 'Kevin Lewis', 'Amanda Walker', 'Brian Hall', 'Stephanie Allen',
  'Matthew Young', 'Michelle King', 'Richard Scott', 'Laura Green', 'Steven Adams'
];

const DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'company.com', 'business.co.za',
  'enterprise.com', 'corporation.co.za', 'solutions.com', 'tech.com', 'services.co.za'
];

class DummyDataGenerator {
  constructor() {
    this.usedEmails = new Set();
    this.usedCompanyNames = new Set();
    this.slaCounter = 1;
    this.invoiceCounter = 1;
  }

  async connect() {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      process.exit(1);
    }
  }

  async disconnect() {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }

  async clearDatabase() {
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Client.deleteMany({});
    await SLA.deleteMany({});
    await Invoice.deleteMany({});
    await Payment.deleteMany({});
    console.log('✅ Database cleared');
  }

  generateUniqueEmail(name) {
    let email;
    let attempts = 0;
    
    do {
      const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
      const username = name.toLowerCase().replace(' ', '.');
      const randomSuffix = attempts > 0 ? `.${Math.random().toString(36).substring(2, 5)}` : '';
      email = `${username}${randomSuffix}@${domain}`;
      attempts++;
    } while (this.usedEmails.has(email) && attempts < 10);
    
    this.usedEmails.add(email);
    return email;
  }

  generateUniqueCompanyName() {
    let companyName;
    let attempts = 0;
    
    do {
      companyName = COMPANY_NAMES[Math.floor(Math.random() * COMPANY_NAMES.length)];
      if (attempts > 0) {
        companyName = `${companyName} ${Math.floor(Math.random() * 1000)}`;
      }
      attempts++;
    } while (this.usedCompanyNames.has(companyName) && attempts < 10);
    
    this.usedCompanyNames.add(companyName);
    return companyName;
  }

  generateRandomPhone() {
    const prefixes = ['+27', '+1', '+44'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.random().toString().slice(2, 11);
    return `${prefix}${number}`;
  }

  generateRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  generateSLANumber() {
    const number = this.slaCounter.toString().padStart(4, '0');
    this.slaCounter++;
    return `SLA${number}`;
  }

  generateInvoiceNumber() {
    const number = this.invoiceCounter.toString().padStart(4, '0');
    this.invoiceCounter++;
    return `INV${number}`;
  }

  getRandomPaymentMethod() {
    const methods = ['eft', 'debit_order', 'credit_card', 'cash'];
    return methods[Math.floor(Math.random() * methods.length)];
  }

  async createAdminUser() {
    console.log('👨‍💼 Creating admin user...');
    
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@businesslab.co.za',
      password: 'password123',
      role: 'admin',
      isActive: true
    });

    await adminUser.save();
    this.usedEmails.add('admin@businesslab.co.za');
    console.log('✅ Admin user created: admin@businesslab.co.za / password123');
    return adminUser;
  }

  async createClients(count = 15) {
    console.log(`👥 Creating ${count} clients...`);
    const clients = [];

    for (let i = 0; i < count; i++) {
      const companyName = this.generateUniqueCompanyName();
      const contactPerson = CONTACT_PERSONS[Math.floor(Math.random() * CONTACT_PERSONS.length)];
      const staffCompliment = Math.floor(Math.random() * 500) + 1;
      const email = this.generateUniqueEmail(contactPerson);
      
      const client = new Client({
        companyName,
        registrationNumber: `REG${2023000 + i}`,
        contactPerson,
        email,
        phone: this.generateRandomPhone(),
        staffCompliment,
        industry: INDUSTRIES[Math.floor(Math.random() * INDUSTRIES.length)],
        address: {
          physical: {
            street: `${Math.floor(Math.random() * 1000) + 1} Main Street`,
            city: 'Johannesburg',
            province: 'Gauteng',
            postalCode: '2000'
          },
          postal: {
            street: `PO Box ${Math.floor(Math.random() * 1000) + 1000}`,
            city: 'Johannesburg',
            province: 'Gauteng',
            postalCode: '2000'
          }
        },
        documents: {
          certifiedCompanyDocs: Math.random() > 0.3,
          certifiedDirectors: Math.random() > 0.3,
          bbbeeScorecard: Math.random() > 0.4,
          companyLetterhead: Math.random() > 0.2,
          vatRegistration: Math.random() > 0.5,
          bankingDetails: Math.random() > 0.2,
          taxClearance: Math.random() > 0.6,
          csdRegistration: Math.random() > 0.4
        },
        status: Math.random() > 0.3 ? 'active' : 'pending'
      });

      await client.save();
      clients.push(client);

      // Create user account for client
      const user = new User({
        name: contactPerson,
        email: client.email,
        password: 'password123',
        role: 'client',
        company: client._id,
        isActive: true
      });
      await user.save();

      console.log(`✅ Created client ${i + 1}: ${companyName} (${email})`);
    }

    console.log(`✅ Created ${clients.length} clients`);
    return clients;
  }

  async createSLAs(clients) {
    console.log('📄 Creating SLAs...');
    const slas = [];

    for (const client of clients) {
      // 80% chance to create an SLA for each client
      if (Math.random() > 0.2) {
        const staffRange = this.getStaffRange(client.staffCompliment);
        const hasPackage = Math.random() > 0.5;
        const packageType = hasPackage ? this.getRandomPackage() : null;

        const services = {
          skillsDevelopment: {
            selected: Math.random() > 0.3,
            staffCompliment: staffRange,
            initiationFee: this.SERVICES.skillsDevelopment[staffRange]?.initiation || 0,
            monthlyFee: this.SERVICES.skillsDevelopment[staffRange]?.monthly || 0,
            status: 'pending',
            progress: Math.floor(Math.random() * 100)
          },
          employmentEquity: {
            selected: Math.random() > 0.4,
            staffCompliment: staffRange,
            initiationFee: this.SERVICES.employmentEquity[staffRange]?.initiation || 0,
            monthlyFee: this.SERVICES.employmentEquity[staffRange]?.monthly || 0,
            status: 'pending',
            progress: Math.floor(Math.random() * 100)
          },
          bbbee: {
            selected: Math.random() > 0.5,
            staffCompliment: this.getBBBEEStaffRange(client.staffCompliment),
            initiationFee: this.SERVICES.bbbee[this.getBBBEEStaffRange(client.staffCompliment)]?.initiation || 0,
            monthlyFee: this.SERVICES.bbbee[this.getBBBEEStaffRange(client.staffCompliment)]?.monthly || 0,
            status: 'pending',
            progress: Math.floor(Math.random() * 100)
          },
          package: packageType ? {
            type: packageType,
            staffCompliment: staffRange,
            initiationFee: this.PACKAGES[packageType][staffRange]?.initiation || 0,
            monthlyFee: this.PACKAGES[packageType][staffRange]?.monthly || 0,
            status: 'pending',
            progress: Math.floor(Math.random() * 100),
            includedServices: this.getPackageServices(packageType)
          } : { type: null }
        };

        const startDate = this.generateRandomDate(new Date(2023, 0, 1), new Date());
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 24);

        // Manually generate SLA number since pre-save hooks might not work in bulk creation
        const slaNumber = this.generateSLANumber();

        const sla = new SLA({
          slaNumber,
          client: client._id,
          startDate,
          endDate,
          services,
          status: Math.random() > 0.2 ? 'active' : 'pending',
          signedAt: Math.random() > 0.3 ? startDate : null,
          autoRenew: Math.random() > 0.5
        });

        // Manually calculate total fees
        let totalMonthly = 0;
        let totalInitiation = 0;

        if (services.skillsDevelopment.selected) {
          totalMonthly += services.skillsDevelopment.monthlyFee || 0;
          totalInitiation += services.skillsDevelopment.initiationFee || 0;
        }

        if (services.employmentEquity.selected) {
          totalMonthly += services.employmentEquity.monthlyFee || 0;
          totalInitiation += services.employmentEquity.initiationFee || 0;
        }

        if (services.bbbee.selected) {
          totalMonthly += services.bbbee.monthlyFee || 0;
          totalInitiation += services.bbbee.initiationFee || 0;
        }

        if (services.package.type) {
          totalMonthly += services.package.monthlyFee || 0;
          totalInitiation += services.package.initiationFee || 0;
        }

        sla.totalMonthlyFee = totalMonthly;
        sla.totalInitiationFee = totalInitiation;

        await sla.save();
        slas.push(sla);

        // Update client status if SLA is active
        if (sla.status === 'active') {
          client.status = 'active';
          await client.save();
        }

        console.log(`✅ Created SLA ${slaNumber} for ${client.companyName}`);
      }
    }

    console.log(`✅ Created ${slas.length} SLAs`);
    return slas;
  }

  async createInvoices(clients, slas) {
    console.log('🧾 Creating invoices...');
    const invoices = [];

    for (const sla of slas) {
      const client = clients.find(c => c._id.toString() === sla.client.toString());
      if (!client) continue;

      // Create initiation fee invoice
      if (sla.totalInitiationFee > 0) {
        const isPaid = Math.random() > 0.3;
        const paymentMethod = isPaid ? this.getRandomPaymentMethod() : null;
        
        const initiationInvoice = new Invoice({
          invoiceNumber: this.generateInvoiceNumber(),
          sla: sla._id,
          client: client._id,
          period: 'Initiation Fee',
          issueDate: sla.startDate,
          dueDate: new Date(sla.startDate.getTime() + 30 * 24 * 60 * 60 * 1000),
          amount: sla.totalInitiationFee,
          initiationFee: true,
          description: 'Service initiation fee',
          status: isPaid ? 'paid' : 'pending',
          paidAt: isPaid ? new Date(sla.startDate.getTime() + 15 * 24 * 60 * 60 * 1000) : null,
          paymentMethod: paymentMethod
        });

        await initiationInvoice.save();
        invoices.push(initiationInvoice);

        // Create payment record ONLY for paid invoices with valid payment method
        if (initiationInvoice.status === 'paid' && initiationInvoice.paymentMethod) {
          try {
            const payment = new Payment({
              invoice: initiationInvoice._id,
              client: client._id,
              amount: initiationInvoice.amount,
              paymentDate: initiationInvoice.paidAt,
              reference: `PAY${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 5)}`,
              method: initiationInvoice.paymentMethod,
              status: 'completed'
            });
            await payment.save();
            console.log(`✅ Created payment for initiation invoice ${initiationInvoice.invoiceNumber}`);
          } catch (paymentError) {
            console.error(`❌ Failed to create payment for initiation invoice:`, paymentError);
          }
        }
      }

      // Create monthly invoices for active SLAs
      if (sla.status === 'active' && sla.totalMonthlyFee > 0) {
        const months = Math.floor((new Date() - sla.startDate) / (30 * 24 * 60 * 60 * 1000));
        
        for (let i = 0; i < Math.min(months, 12); i++) {
          const issueDate = new Date(sla.startDate);
          issueDate.setMonth(issueDate.getMonth() + i);
          
          const dueDate = new Date(issueDate);
          dueDate.setDate(dueDate.getDate() + 30);

          const isPaid = Math.random() > 0.4;
          const isOverdue = !isPaid && dueDate < new Date();
          const paymentMethod = isPaid ? this.getRandomPaymentMethod() : null;

          const invoice = new Invoice({
            invoiceNumber: this.generateInvoiceNumber(),
            sla: sla._id,
            client: client._id,
            period: issueDate.toLocaleString('default', { month: 'long', year: 'numeric' }),
            issueDate,
            dueDate,
            amount: sla.totalMonthlyFee,
            initiationFee: false,
            description: 'Monthly service fee',
            status: isPaid ? 'paid' : (isOverdue ? 'overdue' : 'pending'),
            paidAt: isPaid ? new Date(issueDate.getTime() + 15 * 24 * 60 * 60 * 1000) : null,
            paymentMethod: paymentMethod
          });

          await invoice.save();
          invoices.push(invoice);

          // Create payment record ONLY for paid invoices with valid payment method
          if (invoice.status === 'paid' && invoice.paymentMethod) {
            try {
              const payment = new Payment({
                invoice: invoice._id,
                client: client._id,
                amount: invoice.amount,
                paymentDate: invoice.paidAt,
                reference: `PAY${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 5)}`,
                method: invoice.paymentMethod,
                status: 'completed'
              });
              await payment.save();
              console.log(`✅ Created payment for monthly invoice ${invoice.invoiceNumber}`);
            } catch (paymentError) {
              console.error(`❌ Failed to create payment for monthly invoice:`, paymentError);
            }
          }
        }
      }
    }

    console.log(`✅ Created ${invoices.length} invoices`);
    return invoices;
  }

  getStaffRange(staffCount) {
    if (staffCount <= 20) return '1-20';
    if (staffCount <= 50) return '21-50';
    if (staffCount <= 100) return '51-100';
    if (staffCount <= 250) return '101-250';
    if (staffCount <= 500) return '251-500';
    return '501-750';
  }

  getBBBEEStaffRange(staffCount) {
    if (staffCount <= 10) return '0-10';
    if (staffCount <= 20) return '11-20';
    if (staffCount <= 30) return '21-30';
    if (staffCount <= 40) return '31-40';
    return '41-50';
  }

  getRandomPackage() {
    const packages = ['silver', 'gold', 'platinum'];
    return packages[Math.floor(Math.random() * packages.length)];
  }

  getPackageServices(packageType) {
    const packages = {
      silver: ['Skills Development', 'EE Report and Submission'],
      gold: ['Skills Development', 'Employment Equity', 'HR/IR Support', 'File Preparation'],
      platinum: ['Skills Development', 'Employment Equity', 'IT Support', 'HR/IR', 'Occupational Health and Safety']
    };
    return packages[packageType] || [];
  }

  // Pricing structure
  SERVICES = {
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
    }
  };

  PACKAGES = {
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
  };

  async generateAllData() {
    try {
      await this.connect();
      await this.clearDatabase();

      const adminUser = await this.createAdminUser();
      const clients = await this.createClients(15);
      const slas = await this.createSLAs(clients);
      const invoices = await this.createInvoices(clients, slas);

      console.log('\n🎉 Dummy data generation completed!');
      console.log('====================================');
      console.log(`👨‍💼 Admin Users: 1`);
      console.log(`👥 Clients: ${clients.length}`);
      console.log(`📄 SLAs: ${slas.length}`);
      console.log(`🧾 Invoices: ${invoices.length}`);
      
      console.log('\n🔑 Login Credentials:');
      console.log('Admin: admin@businesslab.co.za / password123');
      console.log('Clients: Use any client email with password: password123');
      
      console.log('\n📊 Sample Client Emails:');
      clients.slice(0, 5).forEach(client => {
        console.log(`- ${client.email} (${client.companyName})`);
      });

    } catch (error) {
      console.error('❌ Error generating dummy data:', error);
    } finally {
      await this.disconnect();
    }
  }
}

// Run the generator
const generator = new DummyDataGenerator();
generator.generateAllData();