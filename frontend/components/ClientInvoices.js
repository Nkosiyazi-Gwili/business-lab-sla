'use client';
import { useState } from 'react';

export default function ClientInvoices({ invoices, client }) {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  if (!invoices || invoices.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          No invoices found for this client.
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return '✅';
      case 'pending': return '⏳';
      case 'overdue': return '⚠️';
      default: return '📄';
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (activeTab === 'all') return true;
    return invoice.status === activeTab;
  });

  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.status === 'paid').length,
    pending: invoices.filter(i => i.status === 'pending').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalAmount: invoices.reduce((sum, invoice) => sum + invoice.amount, 0),
    paidAmount: invoices.filter(i => i.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0),
    pendingAmount: invoices.filter(i => i.status === 'pending').reduce((sum, invoice) => sum + invoice.amount, 0),
    overdueAmount: invoices.filter(i => i.status === 'overdue').reduce((sum, invoice) => sum + invoice.amount, 0),
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const InvoiceRow = ({ invoice }) => (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
          <div className="text-sm text-gray-500">{invoice.period}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatDate(invoice.issueDate)}</div>
        <div className="text-sm text-gray-500">Due: {formatDate(invoice.dueDate)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatCurrency(invoice.amount)}</div>
        {invoice.initiationFee && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
            Initiation
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
          {getStatusIcon(invoice.status)} {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {invoice.paidAt ? formatDate(invoice.paidAt) : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex space-x-2 justify-end">
          <button
            onClick={() => setSelectedInvoice(invoice)}
            className="text-primary-600 hover:text-primary-900 transition-colors"
          >
            View
          </button>
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            Download
          </button>
          {invoice.status !== 'paid' && (
            <button className="text-green-600 hover:text-green-900 transition-colors">
              Pay
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  const InvoiceModal = ({ invoice, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Invoice Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900">{client?.companyName}</h4>
              <p className="text-sm text-gray-600">{client?.contactPerson}</p>
              <p className="text-sm text-gray-600">{client?.email}</p>
            </div>
            <div className="text-right">
              <h4 className="font-semibold text-gray-900">{invoice.invoiceNumber}</h4>
              <p className="text-sm text-gray-600">Issued: {formatDate(invoice.issueDate)}</p>
              <p className="text-sm text-gray-600">Due: {formatDate(invoice.dueDate)}</p>
            </div>
          </div>

          {/* Status & Amount */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                  {getStatusIcon(invoice.status)} {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
                {invoice.paidAt && (
                  <p className="text-sm text-gray-600 mt-1">Paid on {formatDate(invoice.paidAt)}</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(invoice.amount)}</div>
                <div className="text-sm text-gray-600">Total Amount</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">Description</h5>
            <p className="text-gray-600">{invoice.description}</p>
            {invoice.initiationFee && (
              <p className="text-sm text-blue-600 mt-2">This is an initiation fee invoice</p>
            )}
          </div>

          {/* Payment Details */}
          {invoice.status === 'paid' && (
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">Payment Details</h5>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Payment Method:</span>
                    <div className="font-medium text-gray-900 capitalize">{invoice.paymentMethod || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Paid Date:</span>
                    <div className="font-medium text-gray-900">{formatDate(invoice.paidAt)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors">
              Download PDF
            </button>
            {invoice.status !== 'paid' && (
              <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                Pay Now
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Invoices & Payments</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your invoices and payment history
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">
              {formatCurrency(stats.totalAmount)}
            </div>
            <div className="text-sm text-gray-600">Total Invoiced</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
            <div className="text-sm text-gray-600">Paid</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {[
            { id: 'all', name: 'All Invoices', count: stats.total },
            { id: 'paid', name: 'Paid', count: stats.paid },
            { id: 'pending', name: 'Pending', count: stats.pending },
            { id: 'overdue', name: 'Overdue', count: stats.overdue }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.name}</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                activeTab === tab.id ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paid Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInvoices.map((invoice) => (
              <InvoiceRow key={invoice._id || invoice.invoiceNumber} invoice={invoice} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
          <p className="text-gray-600">
            There are no {activeTab !== 'all' ? activeTab : ''} invoices matching your criteria.
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredInvoices.length} of {invoices.length} invoices
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors">
              Export CSV
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors">
              Request Statement
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal 
          invoice={selectedInvoice} 
          onClose={() => setSelectedInvoice(null)} 
        />
      )}
    </div>
  );
}