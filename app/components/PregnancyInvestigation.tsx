// File: src/app/components/PregnancyInvestigation.tsx
'use client';

import { useState, useRef } from 'react';

interface PregnancyData {
  status: string;
  testDate: string;
  testCenter: string;
  result: string;
  medicalReport?: File | null;
  notes?: string;
}

interface PregnancyInvestigationProps {
  onComplete: (data: PregnancyData) => void;
  onBack: () => void;
}

export default function PregnancyInvestigation({ onComplete, onBack }: PregnancyInvestigationProps) {
  const [formData, setFormData] = useState<PregnancyData>({
    status: 'not_tested',
    testDate: '',
    testCenter: '',
    result: 'negative',
    medicalReport: null,
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
      setFormData(prev => ({ ...prev, medicalReport: file }));
      
      // Create preview for images
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
    setFormData(prev => ({ ...prev, medicalReport: null }));
    setDocumentPreview(null);
    if (documentInputRef.current) {
      documentInputRef.current.value = '';
    }
  };

  const statusOptions = [
    { value: 'not_tested', label: 'Not Tested' },
    { value: 'tested', label: 'Test Completed' },
    { value: 'exempt', label: 'Exempt' }
  ];

  const resultOptions = [
    { value: 'negative', label: 'Negative' },
    { value: 'positive', label: 'Positive' },
    { value: 'inconclusive', label: 'Inconclusive' }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Pregnancy Investigation</h2>
      <p className="text-gray-600 mb-8">Record pregnancy test results for the client.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test Information */}
          <div className="space-y-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Test Status *
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

            {formData.status === 'tested' && (
              <>
                <div>
                  <label htmlFor="testDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Test Date *
                  </label>
                  <input
                    type="date"
                    id="testDate"
                    name="testDate"
                    value={formData.testDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="testCenter" className="block text-sm font-medium text-gray-700 mb-1">
                    Test Center
                  </label>
                  <input
                    type="text"
                    id="testCenter"
                    name="testCenter"
                    value={formData.testCenter}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter test center name"
                  />
                </div>

                <div>
                  <label htmlFor="result" className="block text-sm font-medium text-gray-700 mb-1">
                    Test Result *
                  </label>
                  <select
                    id="result"
                    name="result"
                    value={formData.result}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {resultOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Document Upload */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medical Report
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
                      alt="Medical report preview" 
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
                  <p className="text-xs text-gray-500 mt-1">{formData.medicalReport?.name}</p>
                </div>
              ) : formData.medicalReport ? (
                <div className="mt-2 p-3 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700 truncate">{formData.medicalReport.name}</p>
                        <p className="text-xs text-gray-500">{(formData.medicalReport.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-10 h-10 mx-auto" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  <span className="block mt-2 text-sm font-medium">Upload Medical Report</span>
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
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add any additional notes or comments..."
          />
        </div>

        {/* Status Summary */}
        <div className="p-4 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Current Status</h4>
          <div className="flex items-center">
            {formData.status === 'not_tested' && (
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                Not Tested
              </span>
            )}
            {formData.status === 'tested' && formData.result === 'negative' && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Test Completed - Negative
              </span>
            )}
            {formData.status === 'tested' && formData.result === 'positive' && (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                Test Completed - Positive
              </span>
            )}
            {formData.status === 'tested' && formData.result === 'inconclusive' && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                Test Completed - Inconclusive
              </span>
            )}
            {formData.status === 'exempt' && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                Exempt from Testing
              </span>
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
            Continue to Process Status
          </button>
        </div>
      </form>
    </div>
  );
}