'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Updated test account data with actual emails from dummy data generation
const TEST_ACCOUNTS = [
  {
    email: 'admin@businesslab.co.za',
    password: 'password123',
    role: 'admin',
    label: '👨‍💼 Admin Account',
    description: 'Full system access'
  },
  {
    email: 'jennifer.martinez@solutions.com',
    password: 'password123', 
    role: 'client',
    label: '🏢 Creative Solutions',
    description: 'Client account'
  },
  {
    email: 'laura.green@hotmail.com',
    password: 'password123',
    role: 'client', 
    label: '💼 Modern Business Group',
    description: 'Client account'
  },
  {
    email: 'robert.taylor@enterprise.com',
    password: 'password123',
    role: 'client',
    label: '🚀 Enterprise Partners',
    description: 'Client account'
  },
  {
    email: 'laura.green@enterprise.com',
    password: 'password123',
    role: 'client',
    label: '🔧 Smart Systems Co',
    description: 'Client account'
  },
  {
    email: 'susan.white@tech.com',
    password: 'password123',
    role: 'client',
    label: '⚡ Prime Solutions Ltd',
    description: 'Client account'
  }
];

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTestAccounts, setShowTestAccounts] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, formData);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect based on role
      if (response.data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/client');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const autoFill = (account) => {
    setFormData({
      email: account.email,
      password: account.password
    });
    setShowTestAccounts(false);
    setError('');
  };

  const clearForm = () => {
    setFormData({
      email: '',
      password: ''
    });
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Quick Test Accounts Toggle */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => setShowTestAccounts(!showTestAccounts)}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center mx-auto space-x-2"
        >
          <span>🔧 {showTestAccounts ? 'Hide Test Accounts' : 'Show Test Accounts'}</span>
          <svg 
            className={`w-4 h-4 transition-transform ${showTestAccounts ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Test Accounts Panel */}
      {showTestAccounts && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
            <span className="mr-2">🚀</span>
            Quick Test Accounts
          </h3>
          <div className="space-y-2">
            {TEST_ACCOUNTS.map((account, index) => (
              <button
                key={index}
                type="button"
                onClick={() => autoFill(account)}
                className="w-full text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors flex justify-between items-center"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900">{account.label}</div>
                  <div className="text-xs text-gray-600">{account.description}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {account.email} / {account.password}
                  </div>
                </div>
                <div className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  account.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {account.role}
                </div>
              </button>
            ))}
          </div>
          
          {/* Quick Actions */}
          <div className="flex space-x-2 mt-3">
            <button
              type="button"
              onClick={() => autoFill(TEST_ACCOUNTS[0])}
              className="flex-1 bg-purple-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              Fill Admin
            </button>
            <button
              type="button"
              onClick={() => autoFill(TEST_ACCOUNTS[1])}
              className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Fill Client
            </button>
            <button
              type="button"
              onClick={clearForm}
              className="flex-1 bg-gray-500 text-white py-2 px-3 rounded text-sm font-medium hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            placeholder="Enter your password"
          />
        </div>

        {/* Form Actions */}
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
          
          {/* Quick Fill Buttons (when form is empty) */}
          {(!formData.email || !formData.password) && (
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => autoFill(TEST_ACCOUNTS[0])}
                className="px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm"
                title="Fill Admin Credentials"
              >
                👨‍💼
              </button>
              <button
                type="button"
                onClick={() => autoFill(TEST_ACCOUNTS[1])}
                className="px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm"
                title="Fill Client Credentials"
              >
                👥
              </button>
            </div>
          )}
        </div>

        {/* Demo Info */}
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500">
            <strong>Demo Credentials:</strong> Click "Show Test Accounts" above for quick login
          </p>
          <div className="flex justify-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">Admin Account</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Client Accounts</span>
            </div>
          </div>
        </div>
      </form>

      {/* Current Selection Info */}
      {formData.email && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-700">
            <strong>Ready to login as:</strong> {formData.email}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Role: {TEST_ACCOUNTS.find(acc => acc.email === formData.email)?.role || 'Unknown'}
          </div>
        </div>
      )}
    </div>
  );
}