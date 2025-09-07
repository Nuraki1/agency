// File: src/app/components/Dashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardProps {
  clientData: any;
}

export default function Dashboard({ clientData }: DashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentDate] = useState(new Date().toLocaleDateString());

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'completed':
      case 'verified':
      case 'issued':
      case 'negative':
        return 'text-green-700 bg-green-100';
      case 'rejected':
      case 'positive':
      case 'cancelled':
        return 'text-red-700 bg-red-100';
      case 'pending':
      case 'incomplete':
      case 'not_tested':
        return 'text-yellow-700 bg-yellow-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'completed':
      case 'verified':
      case 'issued':
      case 'negative':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        );
      case 'rejected':
      case 'positive':
      case 'cancelled':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewCandidate = () => {
    localStorage.removeItem('currentSessionProgress');
    router.push('/');
  };

  const handleEditCandidate = () => {
    localStorage.setItem('currentCustomer', JSON.stringify(clientData));
    router.push('/');
  };

  // Calculate completion percentage
  const completionPercentage = Math.round(
    (clientData.completedSteps?.length / 7) * 100
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Candidate Dashboard</h1>
            <p className="text-gray-600">Complete profile overview for {clientData.fullName}</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-sm text-gray-500">Generated on: {currentDate}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(clientData.processStatus)}`}>
              {clientData.processStatus?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'personal', label: 'Personal Info' },
              { id: 'documents', label: 'Documents' },
              { id: 'process', label: 'Process Details' },
              { id: 'travel', label: 'Travel Info' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Completion</h3>
              <p className="text-2xl font-bold text-gray-900">{completionPercentage}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Process Status</h3>
              <p className="text-2xl font-bold text-gray-900 capitalize">{clientData.processStatus}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Documents</h3>
              <p className="text-2xl font-bold text-gray-900">
                {[clientData.passport, clientData.photo, clientData.documents?.coc, clientData.documents?.medicalReport].filter(Boolean).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Process Overview</h2>
            
            {/* Process Timeline */}
            <div className="border-l-2 border-gray-200 ml-4">
              {[
                { step: 'Registration', status: clientData.fullName ? 'completed' : 'incomplete', date: clientData.createdAt },
                { step: 'Documents', status: clientData.passport && clientData.photo ? 'completed' : 'incomplete', date: clientData.updatedAt },
                { step: 'Visa/Contract', status: clientData.visaData?.contractStatus || 'incomplete', date: clientData.visaData?.approvalDate },
                { step: 'ELMIS', status: clientData.elmisStatus || 'incomplete', date: clientData.elmisStatus?.verificationDate },
                { step: 'Flight Ticket', status: clientData.ticketData?.status || 'incomplete', date: clientData.ticketData?.bookingDate },
                { step: 'Pregnancy Test', status: clientData.pregnancyStatus || 'incomplete', date: clientData.pregnancyStatus?.testDate },
                { step: 'Final Approval', status: clientData.processStatus || 'pending', date: clientData.completedAt }
              ].map((item, index) => (
                <div key={index} className="relative mb-6 pl-6">
                  <div className="absolute -left-2.5 mt-1.5 w-4 h-4 rounded-full bg-white border-2 border-gray-300">
                    {getStatusIcon(item.status)}
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{item.step}</h3>
                      <p className={`text-sm ${getStatusColor(item.status)} px-2 py-1 rounded-full inline-block mt-1`}>
                        {item.status}
                      </p>
                    </div>
                    {item.date && (
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Full Name</span>
                  <p className="font-medium">{clientData.fullName || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Email</span>
                  <p className="font-medium">{clientData.email || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Phone</span>
                  <p className="font-medium">{clientData.phone || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Date of Birth</span>
                  <p className="font-medium">{clientData.dob || 'Not provided'}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Additional Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Gender</span>
                  <p className="font-medium">{clientData.gender || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Experience Level</span>
                  <p className="font-medium">{clientData.experienceLevel || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Address</span>
                  <p className="font-medium">{clientData.address || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Document Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Passport', status: clientData.passport ? 'Uploaded' : 'Missing' },
                { name: 'Profile Photo', status: clientData.photo ? 'Uploaded' : 'Missing' },
                { name: 'COC Certificate', status: clientData.documents?.coc ? 'Uploaded' : 'Missing' },
                { name: 'Medical Report', status: clientData.documents?.medicalReport ? 'Uploaded' : 'Missing' },
                { name: 'Visa Document', status: clientData.visaData?.visaDocument ? 'Uploaded' : 'Missing' },
                { name: 'Contract Document', status: clientData.visaData?.contractDocument ? 'Uploaded' : 'Missing' },
                { name: 'ELMIS Document', status: clientData.elmisStatus?.document ? 'Uploaded' : 'Missing' },
                { name: 'Flight Ticket', status: clientData.ticketData?.ticketDocument ? 'Uploaded' : 'Missing' }
              ].map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{doc.name}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    doc.status === 'Uploaded' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'process' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800">Process Details</h3>
            
            {clientData.visaData && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Visa & Contract Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div><span className="text-sm text-gray-500">Visa Type:</span> {clientData.visaData.visaType}</div>
                  <div><span className="text-sm text-gray-500">Status:</span> {clientData.visaData.contractStatus}</div>
                  <div><span className="text-sm text-gray-500">Employer:</span> {clientData.visaData.employerName}</div>
                  <div><span className="text-sm text-gray-500">Job Title:</span> {clientData.visaData.jobTitle}</div>
                </div>
              </div>
            )}

            {clientData.elmisStatus && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">ELMIS Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div><span className="text-sm text-gray-500">Status:</span> {clientData.elmisStatus.status}</div>
                  <div><span className="text-sm text-gray-500">Reference:</span> {clientData.elmisStatus.referenceNumber}</div>
                  <div><span className="text-sm text-gray-500">Verified By:</span> {clientData.elmisStatus.verifiedBy}</div>
                  <div><span className="text-sm text-gray-500">Verification Date:</span> {clientData.elmisStatus.verificationDate}</div>
                </div>
              </div>
            )}

            {clientData.pregnancyStatus && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Medical Check</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div><span className="text-sm text-gray-500">Test Status:</span> {clientData.pregnancyStatus.status}</div>
                  <div><span className="text-sm text-gray-500">Result:</span> {clientData.pregnancyStatus.result}</div>
                  <div><span className="text-sm text-gray-500">Test Date:</span> {clientData.pregnancyStatus.testDate}</div>
                  <div><span className="text-sm text-gray-500">Test Center:</span> {clientData.pregnancyStatus.testCenter}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'travel' && clientData.ticketData && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Travel Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Flight Details</h4>
                <div className="space-y-2">
                  <div><span className="text-sm text-blue-600">Airline:</span> {clientData.ticketData.airline}</div>
                  <div><span className="text-sm text-blue-600">Flight Number:</span> {clientData.ticketData.flightNumber}</div>
                  <div><span className="text-sm text-blue-600">From:</span> {clientData.ticketData.departureAirport}</div>
                  <div><span className="text-sm text-blue-600">To:</span> {clientData.ticketData.arrivalAirport}</div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Schedule & Pricing</h4>
                <div className="space-y-2">
                  <div><span className="text-sm text-green-600">Departure:</span> {clientData.ticketData.departureDate} at {clientData.ticketData.departureTime}</div>
                  <div><span className="text-sm text-green-600">Arrival:</span> {clientData.ticketData.arrivalDate} at {clientData.ticketData.arrivalTime}</div>
                  <div><span className="text-sm text-green-600">Fare:</span> {clientData.ticketData.currency} {clientData.ticketData.ticketFare}</div>
                  <div><span className="text-sm text-green-600">Status:</span> {clientData.ticketData.status}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Print Profile
          </button>
          <button
            onClick={handleEditCandidate}
            className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            Edit Candidate
          </button>
          <button
            onClick={handleNewCandidate}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            New Candidate
          </button>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .bg-white {
            background-color: white !important;
          }
          .shadow-md {
            box-shadow: none !important;
          }
          .border {
            border-color: #e5e7eb !important;
          }
          button {
            display: none !important;
          }
          nav {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}