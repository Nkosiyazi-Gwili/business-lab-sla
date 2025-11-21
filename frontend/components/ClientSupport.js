'use client';
import { useState } from 'react';

export default function ClientSupport({ client }) {
  const [activeTab, setActiveTab] = useState('contact');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supportContacts = [
    {
      name: 'General Support',
      email: 'support@businesslab.co.za',
      phone: '+27 11 123 4567',
      description: 'For general inquiries and account support',
      hours: 'Mon-Fri 8:00-17:00',
      icon: '🎯'
    },
    {
      name: 'Technical Support',
      email: 'tech@businesslab.co.za',
      phone: '+27 11 123 4568',
      description: 'For technical issues and platform support',
      hours: 'Mon-Fri 8:00-17:00',
      icon: '🔧'
    },
    {
      name: 'Billing Department',
      email: 'billing@businesslab.co.za',
      phone: '+27 11 123 4569',
      description: 'For billing inquiries and payment support',
      hours: 'Mon-Fri 8:00-16:00',
      icon: '💰'
    },
    {
      name: 'Compliance Team',
      email: 'compliance@businesslab.co.za',
      phone: '+27 11 123 4570',
      description: 'For compliance and document-related queries',
      hours: 'Mon-Fri 8:30-16:30',
      icon: '📋'
    }
  ];

  const faqs = [
    {
      question: 'How do I update my company information?',
      answer: 'You can update your company information by navigating to the Profile section and clicking on "Edit Company Details". Changes may require verification.'
    },
    {
      question: 'What documents are required for SLA activation?',
      answer: 'Required documents include certified company documents, director IDs, B-BBEE scorecard, and company letterhead. Check the Documents section for complete requirements.'
    },
    {
      question: 'How can I download my invoices?',
      answer: 'Invoices can be downloaded from the Invoices section. Click on any invoice and use the "Download PDF" button to get a printable version.'
    },
    {
      question: 'What is the turnaround time for service delivery?',
      answer: 'Standard turnaround time is 5-7 working days. Priority services may be completed within 2-3 working days depending on complexity.'
    },
    {
      question: 'How do I request additional services?',
      answer: 'Contact your account manager or submit a service request through the Support section. We will get back to you within 24 hours.'
    },
    {
      question: 'Can I upgrade my service package?',
      answer: 'Yes, package upgrades can be requested at any time. The changes will be reflected in your next billing cycle.'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reset form
    setMessage('');
    setSubject('');
    setPriority('medium');
    setIsSubmitting(false);
    
    // Show success message (in a real app, you might want to use a toast notification)
    alert('Support request submitted successfully! We will get back to you within 24 hours.');
  };

  const ContactCard = ({ contact }) => (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        <div className="text-2xl">{contact.icon}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{contact.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{contact.description}</p>
          
          <div className="mt-3 space-y-2">
            <div className="flex items-center text-sm text-gray-700">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {contact.email}
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {contact.phone}
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {contact.hours}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const FAQItem = ({ faq, isOpen, onToggle }) => (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={onToggle}
        className="w-full px-4 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900">{faq.question}</span>
        <svg 
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          <p className="text-gray-600">{faq.answer}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Support & Help Center</h2>
        <p className="text-sm text-gray-600 mt-1">
          Get help with your account, services, and technical issues
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {[
            { id: 'contact', name: 'Contact Support', icon: '📞' },
            { id: 'faq', name: 'FAQ', icon: '❓' },
            { id: 'request', name: 'Submit Request', icon: '📝' }
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
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Contacts</h3>
              <p className="text-gray-600 mb-6">
                Reach out to our dedicated support teams for assistance with specific issues.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supportContacts.map((contact, index) => (
                  <ContactCard key={index} contact={contact} />
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 text-xl">💡</div>
                <div>
                  <h4 className="font-semibold text-blue-900">Emergency Support</h4>
                  <p className="text-blue-700 text-sm mt-1">
                    For critical system issues outside business hours, call our emergency line: 
                    <strong> +27 11 123 4599</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
              <p className="text-gray-600 mb-6">
                Find quick answers to common questions about our services and platform.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <FAQItem 
                  key={index} 
                  faq={faq} 
                  isOpen={activeTab === `faq-${index}`}
                  onToggle={() => setActiveTab(activeTab === `faq-${index}` ? 'faq' : `faq-${index}`)}
                />
              ))}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="text-gray-600 text-xl">🔍</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Can't find what you're looking for?</h4>
                  <p className="text-gray-700 text-sm mt-1">
                    Contact our support team for personalized assistance with your specific questions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'request' && (
          <div className="max-w-2xl">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit Support Request</h3>
              <p className="text-gray-600">
                Fill out the form below and our support team will get back to you within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="clientName"
                    value={client?.contactPerson || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="clientEmail"
                    value={client?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="medium">Medium - Standard issue</option>
                  <option value="high">High - Urgent matter</option>
                  <option value="critical">Critical - System down</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Please provide detailed information about your issue or question..."
                />
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-blue-600 text-xl">💡</div>
                <div className="text-sm text-gray-600">
                  <strong>Tip:</strong> Include specific error messages, steps to reproduce the issue, and any relevant screenshots for faster resolution.
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setMessage('');
                    setSubject('');
                    setPriority('medium');
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !message || !subject}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Request</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Average response time: <strong>2-4 hours</strong> during business hours
          </div>
          <div className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}