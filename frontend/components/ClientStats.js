'use client';

export default function ClientStats({ clientData, user }) {
  if (!clientData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">Loading dashboard data...</div>
      </div>
    );
  }

  const { activeSLA, pendingInvoices, recentInvoices, documentCompletion } = clientData;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {activeSLA ? 'Active' : 'No SLA'}
              </div>
              <div className="text-gray-600">SLA Status</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{pendingInvoices}</div>
              <div className="text-gray-600">Pending Invoices</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{documentCompletion}%</div>
              <div className="text-gray-600">Documents Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active SLA Card */}
      {activeSLA && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Active Service Level Agreement</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">SLA Details</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">SLA Number</dt>
                    <dd className="text-sm text-gray-900 font-medium">{activeSLA.slaNumber}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Start Date</dt>
                    <dd className="text-sm text-gray-900">{new Date(activeSLA.startDate).toLocaleDateString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">End Date</dt>
                    <dd className="text-sm text-gray-900">{new Date(activeSLA.endDate).toLocaleDateString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Monthly Fee</dt>
                    <dd className="text-sm text-gray-900 font-medium">R{activeSLA.totalMonthlyFee}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-4">Services Included</h3>
                <div className="space-y-2">
                  {activeSLA.services.skillsDevelopment?.selected && (
                    <div className="flex items-center text-sm text-gray-900">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Skills Development
                    </div>
                  )}
                  {activeSLA.services.employmentEquity?.selected && (
                    <div className="flex items-center text-sm text-gray-900">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Employment Equity
                    </div>
                  )}
                  {activeSLA.services.bbbee?.selected && (
                    <div className="flex items-center text-sm text-gray-900">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      BBBEE
                    </div>
                  )}
                  {activeSLA.services.package?.type && (
                    <div className="flex items-center text-sm text-gray-900">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      {activeSLA.services.package.type.charAt(0).toUpperCase() + activeSLA.services.package.type.slice(1)} Package
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Invoices */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
        </div>
        <div className="p-6">
          {recentInvoices && recentInvoices.length > 0 ? (
            <div className="space-y-4">
              {recentInvoices.slice(0, 5).map(invoice => (
                <div key={invoice._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                    <div className="text-sm text-gray-500">{invoice.period} - {invoice.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">R{invoice.amount}</div>
                    <div className={`text-sm ${
                      invoice.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-2">No invoices found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}