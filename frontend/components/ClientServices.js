'use client';
import { useState } from 'react';

export default function ClientServices({ services, sla }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!services) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          No services found for this client.
        </div>
      </div>
    );
  }

  const getServiceStatus = (service) => {
    if (!service.selected) return 'not-selected';
    return service.status || 'pending';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'not-selected': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const ServiceCard = ({ title, service, price }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(getServiceStatus(service))}`}>
          {getServiceStatus(service).replace('-', ' ')}
        </span>
      </div>
      
      {service.selected && (
        <>
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{service.progress || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor(service.progress || 0)}`}
                style={{ width: `${service.progress || 0}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600">Staff Range:</div>
            <div className="text-gray-900 font-medium">{service.staffCompliment}</div>
            
            <div className="text-gray-600">Initiation Fee:</div>
            <div className="text-gray-900 font-medium">R {service.initiationFee?.toLocaleString() || '0'}</div>
            
            <div className="text-gray-600">Monthly Fee:</div>
            <div className="text-gray-900 font-medium">R {service.monthlyFee?.toLocaleString() || '0'}</div>
          </div>
        </>
      )}
      
      {!service.selected && (
        <div className="text-center py-4">
          <div className="text-gray-500 text-sm">Service not selected</div>
        </div>
      )}
    </div>
  );

  const PackageCard = ({ package: pkg }) => (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 capitalize">{pkg.type} Package</h3>
          <p className="text-sm text-gray-600 mt-1">All-inclusive service bundle</p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(getServiceStatus(pkg))}`}>
          {getServiceStatus(pkg).replace('-', ' ')}
        </span>
      </div>
      
      {pkg.type && (
        <>
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{pkg.progress || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor(pkg.progress || 0)}`}
                style={{ width: `${pkg.progress || 0}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Included Services:</h4>
            <div className="flex flex-wrap gap-1">
              {pkg.includedServices?.map((service, index) => (
                <span key={index} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700">
                  {service}
                </span>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600">Staff Range:</div>
            <div className="text-gray-900 font-medium">{pkg.staffCompliment}</div>
            
            <div className="text-gray-600">Initiation Fee:</div>
            <div className="text-gray-900 font-medium">R {pkg.initiationFee?.toLocaleString() || '0'}</div>
            
            <div className="text-gray-600">Monthly Fee:</div>
            <div className="text-gray-900 font-medium">R {pkg.monthlyFee?.toLocaleString() || '0'}</div>
          </div>
        </>
      )}
      
      {!pkg.type && (
        <div className="text-center py-4">
          <div className="text-gray-500 text-sm">No package selected</div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Services & SLA</h2>
        <p className="text-sm text-gray-600 mt-1">
          Manage your service subscriptions and track progress
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {['overview', 'details', 'progress'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* SLA Info */}
            {sla && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-blue-900">SLA Information</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      {sla.slaNumber} • {sla.status.charAt(0).toUpperCase() + sla.status.slice(1)}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Valid from {new Date(sla.startDate).toLocaleDateString()} to {new Date(sla.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-900">
                      R {sla.totalMonthlyFee?.toLocaleString() || '0'}
                    </div>
                    <div className="text-sm text-blue-700">Monthly Total</div>
                  </div>
                </div>
              </div>
            )}

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ServiceCard 
                title="Skills Development" 
                service={services.skillsDevelopment}
                price={services.skillsDevelopment.monthlyFee}
              />
              <ServiceCard 
                title="Employment Equity" 
                service={services.employmentEquity}
                price={services.employmentEquity.monthlyFee}
              />
              <ServiceCard 
                title="B-BBEE Consulting" 
                service={services.bbbee}
                price={services.bbbee.monthlyFee}
              />
            </div>

            {/* Package */}
            <PackageCard package={services.package} />
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Service Details</h3>
                
                <div className="space-y-3">
                  {[
                    { name: 'Skills Development', service: services.skillsDevelopment },
                    { name: 'Employment Equity', service: services.employmentEquity },
                    { name: 'B-BBEE Consulting', service: services.bbbee }
                  ].map((item, index) => (
                    item.service.selected && (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{item.name}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(getServiceStatus(item.service))}`}>
                              {getServiceStatus(item.service)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Staff Range:</span>
                            <span className="text-gray-900">{item.service.staffCompliment}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly Fee:</span>
                            <span className="text-gray-900">R {item.service.monthlyFee?.toLocaleString() || '0'}</span>
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Package Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Package Details</h3>
                
                {services.package.type ? (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2 capitalize">{services.package.type} Package</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(getServiceStatus(services.package))}`}>
                          {getServiceStatus(services.package)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Staff Range:</span>
                        <span className="text-gray-900">{services.package.staffCompliment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Fee:</span>
                        <span className="text-gray-900">R {services.package.monthlyFee?.toLocaleString() || '0'}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-700 mb-2">Included Services:</h5>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {services.package.includedServices?.map((service, index) => (
                          <li key={index}>{service}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-4 text-center text-gray-500">
                    No package selected
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <h3 className="font-semibold text-gray-900">Service Progress Tracking</h3>
            
            <div className="space-y-4">
              {[
                { name: 'Skills Development', service: services.skillsDevelopment },
                { name: 'Employment Equity', service: services.employmentEquity },
                { name: 'B-BBEE Consulting', service: services.bbbee },
                { name: `${services.package.type ? services.package.type.charAt(0).toUpperCase() + services.package.type.slice(1) : ''} Package`, service: services.package }
              ].map((item, index) => (
                item.service.selected && (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <span className="text-sm text-gray-600">{item.service.progress || 0}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${getProgressColor(item.service.progress || 0)}`}
                        style={{ width: `${item.service.progress || 0}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {item.service.progress === 100 ? 'Completed' : 'In progress'}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}