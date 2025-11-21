'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminHeader from './AdminHeader';
import AdminStats from './AdminStats';
import ClientsTable from './ClientsTable';
import SLAsTable from './SLAsTable';
import InvoicesTable from './InvoicesTable';
import Reports from './Reports';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);
  const [slas, setSlas] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [clientsRes, slasRes, invoicesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/clients?limit=100`, config),
        axios.get(`${API_BASE_URL}/slas?limit=100`, config),
        axios.get(`${API_BASE_URL}/invoices?limit=100`, config)
      ]);

      setClients(clientsRes.data.clients || []);
      setSlas(slasRes.data.slas || []);
      setInvoices(invoicesRes.data.invoices || []);
      
      // Calculate stats
      calculateStats(clientsRes.data.clients, slasRes.data.slas, invoicesRes.data.invoices);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (clients, slas, invoices) => {
    const totalClients = clients?.length || 0;
    const activeClients = clients?.filter(c => c.status === 'active').length || 0;
    const pendingSLAs = slas?.filter(s => s.status === 'pending').length || 0;
    const activeSLAs = slas?.filter(s => s.status === 'active').length || 0;
    const pendingInvoices = invoices?.filter(i => i.status === 'pending').length || 0;
    const paidInvoices = invoices?.filter(i => i.status === 'paid').length || 0;
    const totalRevenue = invoices?.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0) || 0;

    setStats({
      totalClients,
      activeClients,
      pendingSLAs,
      activeSLAs,
      pendingInvoices,
      paidInvoices,
      totalRevenue
    });
  };

  const refreshData = () => {
    setLoading(true);
    loadAdminData();
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
      <AdminHeader onRefresh={refreshData} />
      
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { key: 'dashboard', label: 'Dashboard' },
              { key: 'clients', label: 'Clients' },
              { key: 'slas', label: 'SLAs' },
              { key: 'invoices', label: 'Invoices' },
              { key: 'reports', label: 'Reports' }
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
        {activeTab === 'dashboard' && <AdminStats stats={stats} clients={clients} slas={slas} invoices={invoices} />}
        {activeTab === 'clients' && <ClientsTable clients={clients} onUpdate={refreshData} />}
        {activeTab === 'slas' && <SLAsTable slas={slas} onUpdate={refreshData} />}
        {activeTab === 'invoices' && <InvoicesTable invoices={invoices} onUpdate={refreshData} />}
        {activeTab === 'reports' && <Reports clients={clients} slas={slas} invoices={invoices} />}
      </main>
    </div>
  );
}