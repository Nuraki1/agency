// File: src/app/components/ELMISStatus.tsx
'use client';

import { useState, useRef } from 'react';

interface ELMISData {
  status: string;
  referenceNumber: string;
  submissionDate: string;
  approvalDate: string;
  expiryDate: string;
  verifiedBy: string;
  verificationDate: string;
  qrCode?: string;
  rejectionReason?: string;
  document?: File | null;
  notes?: string;
}

interface ELMISStatusProps {
  onComplete: (data: ELMISData) => void;
  onBack: () => void;
}

export default function ELMISStatus({ onComplete, onBack }: ELMISStatusProps) {
  const [formData, setFormData] = useState<ELMISData>({
    status: 'pending',
    referenceNumber: '',
    submissionDate: '',
    approvalDate: '',
    expiryDate: '',
    verifiedBy: '',
    verificationDate: '',
    qrCode: '',
    rejectionReason: '',
    document: null,
    notes: ''
  });

  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, document: file }));
      
      // Create preview for images only
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setDocumentPreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setDocumentPreview(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const triggerFileInput = () => {
    if (documentInputRef.current) {
      documentInputRef.current.click();
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, document: null }));
    setDocumentPreview(null);
    if (documentInputRef.current) {
      documentInputRef.current.value = '';
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

  const statusOptions = [
    { value: 'checked', label: 'Checked', color: 'bg-blue-100 text-blue-800' },
    { value: 'issued', label: 'Issued', color: 'bg-green-100 text-green-800' },
    { value: 'verified', label: 'Verified (with QR)', color: 'bg-purple-100 text-purple-800' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const generateQRCode = () => {
    // In a real application, this would generate an actual QR code
    // For demo purposes, we'll create a simple data URL
    const qrData = `ELMIS-${formData.referenceNumber}-${Date.now()}`;
    setFormData(prev => ({ 
      ...prev, 
      qrCode: `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="white"/><text x="50" y="50" font-family="Arial" font-size="10" text-anchor="middle">${qrData}</text></svg>`)}`,
      status: 'verified'
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">ELMIS Status</h2>
      <p className="text-gray-600 mb-8">Update the ELMIS (Electronic Labor Migration Information System) status for the client.</p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ELMIS Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-700 border-b pb-2">ELMIS Details</h3>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="referenceNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Reference Number *
              </label>
              <input
                type="text"
                id="referenceNumber"
                name="referenceNumber"
                value={formData.referenceNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter ELMIS reference number"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="submissionDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Submission Date
                </label>
                <input
                  type="date"
                  id="submissionDate"
                  name="submissionDate"
                  value={formData.submissionDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="approvalDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Approval Date
                </label>
                <input
                  type="date"
                  id="approvalDate"
                  name="approvalDate"
                  value={formData.approvalDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
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
            
            {formData.status === 'rejected' && (
              <div>
                <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-1">
                  Rejection Reason *
                </label>
                <textarea
                  id="rejectionReason"
                  name="rejectionReason"
                  value={formData.rejectionReason}
                  onChange={handleInputChange}
                  required={formData.status === 'rejected'}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter reason for rejection"
                />
              </div>
            )}
          </div>
          
          {/* Verification & Documents */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Verification & Documents</h3>
            
            <div>
              <label htmlFor="verifiedBy" className="block text-sm font-medium text-gray-700 mb-1">
                Verified By
              </label>
              <input
                type="text"
                id="verifiedBy"
                name="verifiedBy"
                value={formData.verifiedBy}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter verifier's name"
              />
            </div>
            
            <div>
              <label htmlFor="verificationDate" className="block text-sm font-medium text-gray-700 mb-1">
                Verification Date
              </label>
              <input
                type="date"
                id="verificationDate"
                name="verificationDate"
                value={formData.verificationDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {formData.status === 'verified' && formData.qrCode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  QR Code
                </label>
                <div className="border rounded-md p-4 bg-white flex flex-col items-center">
                  <img 
                    src={formData.qrCode} 
                    alt="ELMIS QR Code" 
                    className="w-32 h-32 border rounded-md object-contain"
                  />
                  <p className="text-xs text-gray-500 mt-2">ELMIS Verified QR Code</p>
                </div>
              </div>
            )}
            
            {formData.status === 'verified' && !formData.qrCode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  QR Code Generation
                </label>
                <button
                  type="button"
                  onClick={generateQRCode}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Generate QR Code
                </button>
                <p className="text-xs text-gray-500 mt-1">Generate QR code for verified status</p>
              </div>
            )}
            
            {/* Document Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ELMIS Document
              </label>
              <input
                type="file"
                ref={documentInputRef}
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
              />
              
              {documentPreview ? (
                <div className="mt-2">
                  <div className="relative inline-block">
                    <img 
                      src={documentPreview} 
                      alt="Document preview" 
                      className="h-32 w-auto border rounded-md object-contain"
                    />
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{getFileName(formData.document)}</p>
                </div>
              ) : formData.document ? (
                <div className="mt-2 p-3 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getFileIcon(formData.document)}
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700 truncate">{getFileName(formData.document)}</p>
                        <p className="text-xs text-gray-500">{(formData.document.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
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
                  onClick={triggerFileInput}
                  className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-blue-500 hover:text-blue-500 mt-2"
                >
                  <svg className="w-10 h-10 mx-auto" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="block mt-2 text-sm font-medium">Upload ELMIS Document</span>
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
            placeholder="Add any additional notes or comments about the ELMIS status..."
          />
        </div>
        
        {/* Status Preview */}
        <div className="p-4 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Status Preview</h4>
          <div className="flex items-center">
            {statusOptions.map(option => (
              option.value === formData.status && (
                <span key={option.value} className={`px-3 py-1 rounded-full text-xs font-medium ${option.color}`}>
                  {option.label}
                </span>
              )
            ))}
            {formData.referenceNumber && (
              <span className="ml-3 text-sm text-gray-600">Ref: {formData.referenceNumber}</span>
            )}
          </div>
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
            Continue to Ticket Status
          </button>
        </div>
      </form>
    </div>
  );
}