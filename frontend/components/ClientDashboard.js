'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ClientHeader from './ClientHeader';
import ClientStats from './ClientStats';
import ClientServices from './ClientServices';
import ClientDocuments from './ClientDocuments';
import ClientInvoices from './ClientInvoices';
import ClientSupport from './ClientSupport';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ClientDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clientData, setClientData] = useState(null);
  const [slas, setSlas] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClientData();
  }, [user]);

  const loadClientData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const clientId = user.company._id || user.company;

      const [dashboardRes, slasRes, invoicesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/clients/${clientId}/dashboard`, config),
        axios.get(`${API_BASE_URL}/slas?client=${clientId}`, config),
        axios.get(`${API_BASE_URL}/invoices?client=${clientId}`, config)
      ]);

      setClientData(dashboardRes.data);
      setSlas(slasRes.data.slas || []);
      setInvoices(invoicesRes.data.invoices || []);
    } catch (error) {
      console.error('Error loading client data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    setLoading(true);
    loadClientData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader user={user} onRefresh={refreshData} />
      
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { key: 'dashboard', label: 'Dashboard' },
              { key: 'services', label: 'Services' },
              { key: 'documents', label: 'Documents' },
              { key: 'invoices', label: 'Invoices' },
              { key: 'support', label: 'Support' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab.key
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && <ClientStats clientData={clientData} user={user} />}
        {activeTab === 'services' && <ClientServices user={user} slas={slas} onUpdate={refreshData} />}
        {activeTab === 'documents' && <ClientDocuments user={user} onUpdate={refreshData} />}
        {activeTab === 'invoices' && <ClientInvoices invoices={invoices} />}
        {activeTab === 'support' && <ClientSupport user={user} />}
      </main>
    </div>
  );
}