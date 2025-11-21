'use client';
import { useState } from 'react';

export default function ClientDocuments({ documents, client }) {
  const [activeTab, setActiveTab] = useState('required');
  const [uploading, setUploading] = useState(false);

  if (!documents) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          No document requirements found.
        </div>
      </div>
    );
  }

  const documentCategories = {
    required: [
      {
        id: 'certifiedCompanyDocs',
        name: 'Certified Company Documents',
        description: 'CIPC registration documents, company registration certificate',
        required: true,
        uploaded: documents.certifiedCompanyDocs,
        icon: '📄'
      },
      {
        id: 'certifiedDirectors',
        name: 'Certified Director IDs',
        description: 'Certified copies of all directors ID documents',
        required: true,
        uploaded: documents.certifiedDirectors,
        icon: '👤'
      },
      {
        id: 'bbbeeScorecard',
        name: 'B-BBEE Scorecard',
        description: 'Current or previous B-BBEE certificate/scorecard',
        required: true,
        uploaded: documents.bbbeeScorecard,
        icon: '📊'
      },
      {
        id: 'companyLetterhead',
        name: 'Company Letterhead',
        description: 'Official company letterhead document',
        required: true,
        uploaded: documents.companyLetterhead,
        icon: '🏢'
      }
    ],
    financial: [
      {
        id: 'vatRegistration',
        name: 'VAT Registration',
        description: 'VAT registration certificate',
        required: false,
        uploaded: documents.vatRegistration,
        icon: '💰'
      },
      {
        id: 'bankingDetails',
        name: 'Banking Details',
        description: 'Company banking details confirmation',
        required: false,
        uploaded: documents.bankingDetails,
        icon: '🏦'
      },
      {
        id: 'taxClearance',
        name: 'Tax Clearance Certificate',
        description: 'Latest tax clearance certificate',
        required: false,
        uploaded: documents.taxClearance,
        icon: '📋'
      }
    ],
    additional: [
      {
        id: 'csdRegistration',
        name: 'CSD Registration',
        description: 'Central Supplier Database registration',
        required: false,
        uploaded: documents.csdRegistration,
        icon: '🔧'
      }
    ]
  };

  const allDocuments = [
    ...documentCategories.required,
    ...documentCategories.financial,
    ...documentCategories.additional
  ];

  const uploadedCount = allDocuments.filter(doc => doc.uploaded).length;
  const totalCount = allDocuments.length;
  const requiredUploadedCount = documentCategories.required.filter(doc => doc.uploaded).length;
  const totalRequiredCount = documentCategories.required.length;

  const getStatusColor = (uploaded) => {
    return uploaded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusText = (uploaded) => {
    return uploaded ? 'Uploaded' : 'Pending';
  };

  const handleFileUpload = async (documentId, file) => {
    setUploading(true);
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUploading(false);
    // In a real app, you would call an API here
    console.log(`Uploading ${file.name} for ${documentId}`);
  };

  const DocumentCard = ({ document }) => (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">{document.icon}</div>
          <div>
            <h3 className="font-medium text-gray-900">{document.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{document.description}</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.uploaded)}`}>
          {getStatusText(document.uploaded)}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          {document.required && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Required
            </span>
          )}
        </div>
        
        {!document.uploaded && (
          <div className="flex space-x-2">
            <button
              onClick={() => document.getElementById(`file-${document.id}`)?.click()}
              disabled={uploading}
              className="px-3 py-1 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <input
              id={`file-${document.id}`}
              type="file"
              className="hidden"
              onChange={(e) => handleFileUpload(document.id, e.target.files[0])}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </div>
        )}
        
        {document.uploaded && (
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors">
              View
            </button>
            <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors">
              Download
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Company Documents</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your company documentation and compliance requirements
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">
              {uploadedCount}/{totalCount}
            </div>
            <div className="text-sm text-gray-600">Documents Uploaded</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Completion Progress</span>
          <span className="text-sm text-gray-600">{Math.round((uploadedCount / totalCount) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(uploadedCount / totalCount) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Required: {requiredUploadedCount}/{totalRequiredCount}</span>
          <span>Optional: {uploadedCount - requiredUploadedCount}/{totalCount - totalRequiredCount}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {[
            { id: 'required', name: 'Required Documents', count: documentCategories.required.length },
            { id: 'financial', name: 'Financial', count: documentCategories.financial.length },
            { id: 'additional', name: 'Additional', count: documentCategories.additional.length },
            { id: 'all', name: 'All Documents', count: allDocuments.length }
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

      {/* Content */}
      <div className="p-6">
        {activeTab === 'required' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Required Documents</h3>
            <p className="text-sm text-gray-600 mb-4">
              These documents are required for SLA activation and compliance processing.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documentCategories.required.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Financial Documents</h3>
            <p className="text-sm text-gray-600 mb-4">
              Financial compliance and registration documents.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documentCategories.financial.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'additional' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Additional Documents</h3>
            <p className="text-sm text-gray-600 mb-4">
              Optional documents for enhanced service delivery.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documentCategories.additional.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'all' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">All Documents</h3>
              <p className="text-sm text-gray-600 mb-4">
                Complete list of all required and optional documents.
              </p>
            </div>
            
            {/* Required Section */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 border-b pb-2">Required Documents</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentCategories.required.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            </div>

            {/* Financial Section */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 border-b pb-2">Financial Documents</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentCategories.financial.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            </div>

            {/* Additional Section */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 border-b pb-2">Additional Documents</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentCategories.additional.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors">
              Download All
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors">
              Request Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}