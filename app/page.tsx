// File: src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import ClientRegistration from './components/ClientRegistration';
import DocumentUpload from './components/DocumentUpload';
import VisaContractStatus from './components/VisaContractStatus';
import ELMISStatus from './components/ELMISStatus';
import TicketStatus from './components/TicketStatus';
import PregnancyInvestigation from './components/PregnancyInvestigation';
import ProcessStatus from './components/ProcessStatus';
import Dashboard from './components/Dashboard';
import NavBar from './components/NavBar';
import { useRouter } from 'next/navigation';

type ProcessStep = 
  | 'registration'
  | 'document_upload'
  | 'visa_contract'
  | 'elmis_status'
  | 'ticket_status'
  | 'pregnancy_check'
  | 'process_status'
  | 'completed';

interface Customer {
  id: number;
  fullName: string;
  experienceLevel: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  gender: string;
  passport?: any;
  photo?: any;
  documents?: any;
  visaData?: any;
  elmisStatus?: string;
  ticketData?: any;
  pregnancyStatus?: string;
  processStatus?: string;
  completedSteps?: ProcessStep[];
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<ProcessStep>('registration');
  const [clientData, setClientData] = useState<any>({});
  const [isClient, setIsClient] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    // Load customers from localStorage
    const savedCustomers = localStorage.getItem('foreignEmploymentCustomers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }

    // Check if we have a customer to edit
    const currentCustomer = localStorage.getItem('currentCustomer');
    if (currentCustomer) {
      const customer = JSON.parse(currentCustomer);
      setClientData(customer);
      // Determine which step to show based on what data is available
      if (customer.processStatus) {
        setCurrentStep('completed');
      } else if (customer.pregnancyStatus) {
        setCurrentStep('process_status');
      } else if (customer.ticketData) {
        setCurrentStep('pregnancy_check');
      } else if (customer.elmisStatus) {
        setCurrentStep('ticket_status');
      } else if (customer.visaData) {
        setCurrentStep('elmis_status');
      } else if (customer.documents) {
        setCurrentStep('visa_contract');
      } else if (customer.passport || customer.photo) {
        setCurrentStep('document_upload');
      }
      localStorage.removeItem('currentCustomer');
    }

    // Save current session progress
    const sessionProgress = localStorage.getItem('currentSessionProgress');
    if (sessionProgress) {
      const progress = JSON.parse(sessionProgress);
      setCurrentStep(progress.currentStep);
      setClientData(progress.clientData || {});
    }
  }, []);

  // Save session progress whenever it changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('currentSessionProgress', JSON.stringify({
        currentStep,
        clientData
      }));
    }
  }, [currentStep, clientData, isClient]);

  const saveCustomer = (data: any) => {
    const completedSteps = clientData.completedSteps || [];
    if (!completedSteps.includes(currentStep)) {
      completedSteps.push(currentStep);
    }

    const newCustomer = {
      id: clientData.id || Date.now(),
      ...clientData,
      ...data,
      completedSteps,
      processStatus: data.processStatus || (currentStep === 'process_status' ? 'pending' : undefined)
    };

    const updatedCustomers = [...customers.filter(c => c.id !== newCustomer.id), newCustomer];
    setCustomers(updatedCustomers);
    localStorage.setItem('foreignEmploymentCustomers', JSON.stringify(updatedCustomers));
    setClientData(newCustomer);
  };

  const handleStepComplete = (step: ProcessStep, data: any) => {
    const updatedData = { ...clientData, ...data };
    
    // Save customer data at each step
    saveCustomer(updatedData);

    // Define the next step in the process
    const steps: ProcessStep[] = [
      'registration',
      'document_upload',
      'visa_contract',
      'elmis_status',
      'ticket_status',
      'pregnancy_check',
      'process_status',
      'completed'
    ];
    
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: ProcessStep[] = [
      'registration',
      'document_upload',
      'visa_contract',
      'elmis_status',
      'ticket_status',
      'pregnancy_check',
      'process_status',
      'completed'
    ];
    
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const navigateToStep = (step: ProcessStep) => {
    // Allow navigation to any completed step or the next logical step
    const steps: ProcessStep[] = [
      'registration',
      'document_upload',
      'visa_contract',
      'elmis_status',
      'ticket_status',
      'pregnancy_check',
      'process_status',
      'completed'
    ];
    
    const currentIndex = steps.indexOf(currentStep);
    const targetIndex = steps.indexOf(step);
    
    const completedSteps = clientData.completedSteps || [];
    
    // Allow navigation if the step is completed or is the next logical step
    if (completedSteps.includes(step) || targetIndex <= currentIndex + 1) {
      setCurrentStep(step);
    }
  };

  const renderStep = () => {
    if (!isClient) {
      return <div className="p-6 text-center">Loading...</div>;
    }

    switch (currentStep) {
      case 'registration':
        return (
          <ClientRegistration 
            onComplete={(data) => handleStepComplete('registration', data)} 
            showViewProfilesButton={true}
            onBack={currentStep !== 'registration' ? handleBack : undefined}
          />
        );
      case 'document_upload':
        return (
          <DocumentUpload 
            onComplete={(data) => handleStepComplete('document_upload', data)} 
            onBack={handleBack}
          />
        );
      case 'visa_contract':
        return (
          <VisaContractStatus 
            onComplete={(data) => handleStepComplete('visa_contract', data)} 
            onBack={handleBack}
          />
        );
      case 'elmis_status':
        return (
          <ELMISStatus 
            onComplete={(data) => handleStepComplete('elmis_status', data)} 
            onBack={handleBack}
          />
        );
      case 'ticket_status':
        return (
          <TicketStatus 
            onComplete={(data) => handleStepComplete('ticket_status', data)} 
            onBack={handleBack}
          />
        );
      case 'pregnancy_check':
        return (
          <PregnancyInvestigation 
            onComplete={(data) => handleStepComplete('pregnancy_check', data)} 
            onBack={handleBack}
          />
        );
      case 'process_status':
        return (
          <ProcessStatus 
            clientData={clientData} 
            onComplete={(data) => handleStepComplete('process_status', data)} 
            onBack={handleBack}
          />
        );
      case 'completed':
        return <Dashboard clientData={clientData} />;
      default:
        return <ClientRegistration onComplete={(data) => handleStepComplete('registration', data)} />;
    }
  };

  const getStepStatus = (step: ProcessStep) => {
    const completedSteps = clientData.completedSteps || [];
    const steps = [
      'registration',
      'document_upload',
      'visa_contract',
      'elmis_status',
      'ticket_status',
      'pregnancy_check',
      'process_status',
      'completed'
    ];
    
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);
    
    if (completedSteps.includes(step)) {
      return 'completed';
    } else if (stepIndex <= currentIndex) {
      return 'current';
    } else {
      return 'upcoming';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar currentPage="dashboard" />
      
      <main className="container mx-auto p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">Client Processing System</h2>
            
            {/* Progress Bar - Mobile */}
            <div className="md:hidden mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">
                  Step {['registration', 'document_upload', 'visa_contract', 'elmis_status', 'ticket_status', 'pregnancy_check', 'process_status', 'completed'].indexOf(currentStep) + 1} of 8
                </span>
                <span className="text-xs font-medium text-blue-600">
                  {Math.round(((['registration', 'document_upload', 'visa_contract', 'elmis_status', 'ticket_status', 'pregnancy_check', 'process_status', 'completed'].indexOf(currentStep)) / 7) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-2 transition-all duration-500"
                  style={{ width: `${((['registration', 'document_upload', 'visa_contract', 'elmis_status', 'ticket_status', 'pregnancy_check', 'process_status', 'completed'].indexOf(currentStep)) / 7) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Progress Bar - Desktop */}
            <div className="hidden md:block">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-2 transition-all duration-500"
                    style={{ width: `${((['registration', 'document_upload', 'visa_contract', 'elmis_status', 'ticket_status', 'pregnancy_check', 'process_status', 'completed'].indexOf(currentStep)) / 7) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Step Navigation - Desktop */}
            <div className="hidden md:flex justify-between text-sm text-gray-600">
              {[
                { step: 'registration', label: 'Registration' },
                { step: 'document_upload', label: 'Documents' },
                { step: 'visa_contract', label: 'Visa/Contract' },
                { step: 'elmis_status', label: 'ELMIS' },
                { step: 'ticket_status', label: 'Ticket' },
                { step: 'pregnancy_check', label: 'Pregnancy' },
                { step: 'process_status', label: 'Status' }
              ].map(({ step, label }) => {
                const status = getStepStatus(step as ProcessStep);
                return (
                  <button
                    key={step}
                    onClick={() => navigateToStep(step as ProcessStep)}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      status === 'completed' 
                        ? 'text-green-600 hover:text-green-700 font-medium' 
                        : status === 'current'
                        ? 'text-blue-600 font-bold'
                        : 'text-gray-400'
                    } ${status !== 'upcoming' ? 'cursor-pointer' : 'cursor-default'}`}
                    disabled={status === 'upcoming'}
                    title={status === 'upcoming' ? 'Complete previous steps first' : `Go to ${label}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Step Navigation - Mobile */}
            <div className="md:hidden grid grid-cols-4 gap-2 text-xs">
              {[
                { step: 'registration', label: 'Reg' },
                { step: 'document_upload', label: 'Docs' },
                { step: 'visa_contract', label: 'Visa' },
                { step: 'elmis_status', label: 'ELMIS' },
                { step: 'ticket_status', label: 'Ticket' },
                { step: 'pregnancy_check', label: 'Preg' },
                { step: 'process_status', label: 'Status' }
              ].map(({ step, label }) => {
                const status = getStepStatus(step as ProcessStep);
                return (
                  <button
                    key={step}
                    onClick={() => navigateToStep(step as ProcessStep)}
                    className={`px-1 py-1 rounded text-center transition-colors ${
                      status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : status === 'current'
                        ? 'bg-blue-100 text-blue-700 font-bold'
                        : 'bg-gray-100 text-gray-400'
                    } ${status !== 'upcoming' ? 'cursor-pointer' : 'cursor-default'}`}
                    disabled={status === 'upcoming'}
                    title={status === 'upcoming' ? 'Complete previous steps first' : `Go to ${label}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {renderStep()}
        </div>

        {/* Session Info Footer */}
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>Your progress is automatically saved. You can return anytime to complete remaining steps.</p>
          {clientData.fullName && (
            <p className="mt-1">Currently editing: <span className="font-medium">{clientData.fullName}</span></p>
          )}
        </div>
      </main>
    </div>
  );
}