// File: src/app/components/VisaContractStatus.tsx
'use client';

import { useState, useEffect, useRef } from 'react';

interface VisaContractData {
  visaType: string;
  contractStatus: string;
  visaNumber: string;
  issueDate: string;
  expiryDate: string;
  employerName: string;
  employerAddress: string;
  jobTitle: string;
  salary: string;
  contractDuration: string;
  visaDocument?: File | null;
  contractDocument?: File | null;
  notes?: string;
}

interface VisaContractStatusProps {
  onComplete: (data: VisaContractData) => void;
  onBack: () => void;
}

export default function VisaContractStatus({ onComplete, onBack }: VisaContractStatusProps) {
  const [formData, setFormData] = useState<VisaContractData>({
    visaType: '',
    contractStatus: 'pending',
    visaNumber: '',
    issueDate: '',
    expiryDate: '',
    employerName: '',
    employerAddress: '',
    jobTitle: '',
    salary: '',
    contractDuration: '',
    visaDocument: null,
    contractDocument: null,
    notes: ''
  });

  const [visaDocPreview, setVisaDocPreview] = useState<string | null>(null);
  const [contractDocPreview, setContractDocPreview] = useState<string | null>(null);
  const visaInputRef = useRef<HTMLInputElement>(null);
  const contractInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'visaDocument' | 'contractDocument') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [fileType]: file }));
      
      // Create preview for images only
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (fileType === 'visaDocument') {
            setVisaDocPreview(event.target?.result as string);
          } else {
            setContractDocPreview(event.target?.result as string);
          }
        };
        reader.readAsDataURL(file);
      } else {
        // For PDFs, clear any previous image preview
        if (fileType === 'visaDocument') {
          setVisaDocPreview(null);
        } else {
          setContractDocPreview(null);
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const triggerFileInput = (fileType: 'visaDocument' | 'contractDocument') => {
    if (fileType === 'visaDocument' && visaInputRef.current) {
      visaInputRef.current.click();
    } else if (fileType === 'contractDocument' && contractInputRef.current) {
      contractInputRef.current.click();
    }
  };

  const removeFile = (fileType: 'visaDocument' | 'contractDocument') => {
    setFormData(prev => ({ ...prev, [fileType]: null }));
    if (fileType === 'visaDocument') {
      setVisaDocPreview(null);
      if (visaInputRef.current) {
        visaInputRef.current.value = '';
      }
    } else {
      setContractDocPreview(null);
      if (contractInputRef.current) {
        contractInputRef.current.value = '';
      }
    }
  };

  const getFileName = (file: File | null | undefined) => {
    return file ? file.name : 'No file chosen';
  };

  const getFileIcon = (file: File | null | undefined) => {
    if (!file) return null;
    
    if (file.type.startsWith('image/')) {
      return (
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      );
    } else if (file.type === 'application/pdf') {
      return (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
      );
    }
    
    return (
      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
    );
  };

  const visaTypes = [
    'Employment Visa',
    'Work Permit',
    'Business Visa',
    'Residence Visa',
    'Temporary Work Visa',
    'Other'
  ];

  const contractStatuses = [
    { value: 'pending', label: 'Pending Approval' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'issued', label: 'Visa Issued' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Visa & Contract Status</h2>
      <p className="text-gray-600 mb-8">Update visa and employment contract details for the client.</p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Visa Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Visa Information</h3>
            
            <div>
              <label htmlFor="visaType" className="block text-sm font-medium text-gray-700 mb-1">
                Visa Type *
              </label>
              <select
                id="visaType"
                name="visaType"
                value={formData.visaType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Visa Type</option>
                {visaTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="visaNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Visa Number
              </label>
              <input
                type="text"
                id="visaNumber"
                name="visaNumber"
                value={formData.visaNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter visa number"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  id="issueDate"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="contractStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Visa Status *
              </label>
              <select
                id="contractStatus"
                name="contractStatus"
                value={formData.contractStatus}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {contractStatuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
            
            {/* Visa Document Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visa Document
              </label>
              <input
                type="file"
                ref={visaInputRef}
                onChange={(e) => handleFileChange(e, 'visaDocument')}
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
              />
              
              {visaDocPreview ? (
                <div className="mt-2">
                  <div className="relative inline-block">
                    <img 
                      src={visaDocPreview} 
                      alt="Visa document preview" 
                      className="h-32 w-auto border rounded-md object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile('visaDocument')}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{getFileName(formData.visaDocument)}</p>
                </div>
              ) : formData.visaDocument ? (
                <div className="mt-2 p-3 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getFileIcon(formData.visaDocument)}
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700 truncate">{getFileName(formData.visaDocument)}</p>
                        <p className="text-xs text-gray-500">{(formData.visaDocument.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('visaDocument')}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => triggerFileInput('visaDocument')}
                  className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-blue-500 hover:text-blue-500 mt-2"
                >
                  <svg className="w-10 h-10 mx-auto" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="block mt-2 text-sm font-medium">Upload Visa Document</span>
                  <span className="block text-xs mt-1">JPG, PNG or PDF (Max 5MB)</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Contract Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Employment Contract</h3>
            
            <div>
              <label htmlFor="employerName" className="block text-sm font-medium text-gray-700 mb-1">
                Employer Name *
              </label>
              <input
                type="text"
                id="employerName"
                name="employerName"
                value={formData.employerName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter employer name"
              />
            </div>
            
            <div>
              <label htmlFor="employerAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Employer Address
              </label>
              <textarea
                id="employerAddress"
                name="employerAddress"
                value={formData.employerAddress}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter employer address"
              />
            </div>
            
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter job title"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                  Salary *
                </label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., $2000/month"
                />
              </div>
              
              <div>
                <label htmlFor="contractDuration" className="block text-sm font-medium text-gray-700 mb-1">
                  Contract Duration *
                </label>
                <input
                  type="text"
                  id="contractDuration"
                  name="contractDuration"
                  value={formData.contractDuration}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 2 years"
                />
              </div>
            </div>
            
            {/* Contract Document Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract Document
              </label>
              <input
                type="file"
                ref={contractInputRef}
                onChange={(e) => handleFileChange(e, 'contractDocument')}
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
              />
              
              {contractDocPreview ? (
                <div className="mt-2">
                  <div className="relative inline-block">
                    <img 
                      src={contractDocPreview} 
                      alt="Contract document preview" 
                      className="h-32 w-auto border rounded-md object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile('contractDocument')}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{getFileName(formData.contractDocument)}</p>
                </div>
              ) : formData.contractDocument ? (
                <div className="mt-2 p-3 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getFileIcon(formData.contractDocument)}
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700 truncate">{getFileName(formData.contractDocument)}</p>
                        <p className="text-xs text-gray-500">{(formData.contractDocument.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('contractDocument')}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => triggerFileInput('contractDocument')}
                  className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-green-500 hover:text-green-500 mt-2"
                >
                  <svg className="w-10 h-10 mx-auto" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="block mt-2 text-sm font-medium">Upload Contract Document</span>
                  <span className="block text-xs mt-1">JPG, PNG or PDF (Max 5MB)</span>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Additional Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add any additional notes or comments about the visa or contract status..."
          />
        </div>
        
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Back
          </button>
          
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Continue to ELMIS Status
          </button>
        </div>
      </form>
    </div>
  );
}