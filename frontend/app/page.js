'use client';
import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

export default function Home() {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary-900 mb-2">
              Business Lab
            </h1>
            <p className="text-primary-600">SLA Management System</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-primary-200 overflow-hidden">
            <div className="flex border-b border-primary-200">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-4 font-semibold ${
                  activeTab === 'login'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-primary-700 hover:bg-primary-50'
                } transition-colors`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-4 font-semibold ${
                  activeTab === 'register'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-primary-700 hover:bg-primary-50'
                } transition-colors`}
              >
                Register
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'login' && <LoginForm />}
              {activeTab === 'register' && <RegisterForm />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}