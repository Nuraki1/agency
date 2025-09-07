// File: src/app/components/ProcessStatus.tsx
'use client';

import { useState, useEffect } from 'react';

interface ProcessStatusProps {
  clientData: any;
  onComplete: (data: any) => void;
  onBack: () => void;
}

export default function ProcessStatus({ clientData, onComplete, onBack }: ProcessStatusProps) {
  const [finalStatus, setFinalStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [statusDetails, setStatusDetails] = useState<any>({});
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    // Calculate final status based on all previous data
    calculateFinalStatus();
  }, [clientData]);

  const calculateFinalStatus = () => {
    const details: any = {
      registration: { completed: !!clientData.fullName, status: !!clientData.fullName ? 'complete' : 'incomplete' },
      documents: { completed: !!(clientData.passport && clientData.photo), status: !!(clientData.passport && clientData.photo) ? 'complete' : 'incomplete' },
      cocMedical: { completed: !!(clientData.documents?.coc && clientData.documents?.medicalReport), status: !!(clientData.documents?.coc && clientData.documents?.medicalReport) ? 'complete' : 'incomplete' },
      visa: { completed: !!clientData.visaData, status: clientData.visaData?.contractStatus || 'incomplete' },
      elmis: { completed: !!clientData.elmisStatus, status: clientData.elmisStatus || 'incomplete' },
      ticket: { completed: !!clientData.ticketData, status: clientData.ticketData?.status || 'incomplete' },
      pregnancy: { completed: !!clientData.pregnancyStatus, status: clientData.pregnancyStatus || 'incomplete' }
    };

    setStatusDetails(details);

    // Determine final status
    let status: 'pending' | 'approved' | 'rejected' = 'pending';

    // Check for immediate rejection criteria
    if (details.pregnancy.status === 'positive') {
      status = 'rejected';
    } else if (details.visa.status === 'rejected') {
      status = 'rejected';
    } else if (details.elmis.status === 'rejected') {
      status = 'rejected';
    } 
    // Check for approval criteria (all required steps completed with positive status)
    else if (
      details.registration.status === 'complete' &&
      details.documents.status === 'complete' &&
      details.cocMedical.status === 'complete' &&
      ['approved', 'issued', 'verified'].includes(details.visa.status) &&
      ['issued', 'verified', 'checked'].includes(details.elmis.status) &&
      ['issued', 'booked', 'confirmed'].includes(details.ticket.status) &&
      (details.pregnancy.status === 'negative' || details.pregnancy.status === 'exempt' || details.pregnancy.status === 'not_tested')
    ) {
      status = 'approved';
    }

    setFinalStatus(status);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      processStatus: finalStatus,
      finalRemarks: remarks,
      completedAt: new Date().toISOString()
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
      case 'approved':
      case 'issued':
      case 'verified':
      case 'checked':
      case 'booked':
      case 'confirmed':
      case 'negative':
      case 'exempt':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        );
      case 'rejected':
      case 'positive':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
      case 'approved':
      case 'issued':
      case 'verified':
      case 'checked':
      case 'booked':
      case 'confirmed':
      case 'negative':
      case 'exempt':
        return 'text-green-700 bg-green-100';
      case 'rejected':
      case 'positive':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'complete': return 'Complete';
      case 'incomplete': return 'Incomplete';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'issued': return 'Issued';
      case 'verified': return 'Verified';
      case 'checked': return 'Checked';
      case 'booked': return 'Booked';
      case 'confirmed': return 'Confirmed';
      case 'positive': return 'Positive';
      case 'negative': return 'Negative';
      case 'exempt': return 'Exempt';
      case 'not_tested': return 'Not Tested';
      default: return status;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Process Status</h2>
      <p className="text-gray-600 mb-8">Final review and status determination for the candidate.</p>

      {/* Candidate Summary */}
      <div className="bg-white border rounded-lg p-6 mb-8 shadow-sm">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Candidate Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">{clientData.fullName || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{clientData.email || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-medium">{clientData.phone || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Experience</p>
            <p className="font-medium">{clientData.experienceLevel || 'Not provided'}</p>
          </div>
        </div>
      </div>

      {/* Process Status Overview */}
      <div className="bg-white border rounded-lg p-6 mb-8 shadow-sm">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Process Overview</h3>
        
        <div className="space-y-4">
          {Object.entries(statusDetails).map(([key, detail]: [string, any]) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center">
                {getStatusIcon(detail.status)}
                <span className="ml-3 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(detail.status)}`}>
                {getStatusText(detail.status)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Final Status Determination */}
      <div className="bg-white border rounded-lg p-6 mb-8 shadow-sm">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Final Status Determination</h3>
        
        <div className={`p-4 rounded-lg mb-4 ${
          finalStatus === 'approved' ? 'bg-green-50 border border-green-200' :
          finalStatus === 'rejected' ? 'bg-red-50 border border-red-200' :
          'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {finalStatus === 'approved' && (
                <svg className="w-8 h-8 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              )}
              {finalStatus === 'rejected' && (
                <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              )}
              {finalStatus === 'pending' && (
                <svg className="w-8 h-8 text-yellow-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              )}
              <div>
                <h4 className="text-lg font-semibold">
                  {finalStatus === 'approved' ? 'Approved - Ready for Deployment' :
                   finalStatus === 'rejected' ? 'Rejected - Process Terminated' :
                   'Pending - Requires Completion'}
                </h4>
                <p className="text-sm opacity-75">
                  {finalStatus === 'approved' ? 'Candidate has met all requirements and is ready for foreign employment.' :
                   finalStatus === 'rejected' ? 'Candidate does not meet the required criteria for foreign employment.' :
                   'Some process steps are incomplete or pending verification.'}
                </p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              finalStatus === 'approved' ? 'bg-green-100 text-green-800' :
              finalStatus === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {finalStatus.toUpperCase()}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
              Final Remarks
            </label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any final remarks or comments about the candidate's process..."
            />
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Back
            </button>
            
            <button
              type="submit"
              className={`px-6 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                finalStatus === 'approved' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' :
                finalStatus === 'rejected' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' :
                'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              }`}
            >
              {finalStatus === 'approved' ? 'Approve & Complete Process' :
               finalStatus === 'rejected' ? 'Reject & Terminate Process' :
               'Save as Pending'}
            </button>
          </div>
        </form>
      </div>

      {/* Process Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-800">Process Notes</h4>
            <p className="text-sm text-blue-600 mt-1">
              The final status is automatically determined based on the completion and results of all previous steps. 
              You can add final remarks before completing the process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}