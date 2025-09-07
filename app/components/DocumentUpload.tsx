// File: src/app/components/DocumentUpload.tsx
'use client';

import { useState, useRef } from 'react';

interface DocumentData {
  coc?: File | null;
  medicalReport?: File | null;
  documents?: any;
}

interface DocumentUploadProps {
  onComplete: (data: DocumentData) => void;
  onBack: () => void;
}

export default function DocumentUpload({ onComplete, onBack }: DocumentUploadProps) {
  const [formData, setFormData] = useState<DocumentData>({
    coc: null,
    medicalReport: null
  });
  const [cocPreview, setCocPreview] = useState<string | null>(null);
  const [medicalPreview, setMedicalPreview] = useState<string | null>(null);
  const cocInputRef = useRef<HTMLInputElement>(null);
  const medicalInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'coc' | 'medicalReport') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [fileType]: file }));
      
      // Create preview for images only
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (fileType === 'coc') {
            setCocPreview(event.target?.result as string);
          } else {
            setMedicalPreview(event.target?.result as string);
          }
        };
        reader.readAsDataURL(file);
      } else {
        // For PDFs, clear any previous image preview
        if (fileType === 'coc') {
          setCocPreview(null);
        } else {
          setMedicalPreview(null);
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const triggerFileInput = (fileType: 'coc' | 'medicalReport') => {
    if (fileType === 'coc' && cocInputRef.current) {
      cocInputRef.current.click();
    } else if (fileType === 'medicalReport' && medicalInputRef.current) {
      medicalInputRef.current.click();
    }
  };

  const removeFile = (fileType: 'coc' | 'medicalReport') => {
    setFormData(prev => ({ ...prev, [fileType]: null }));
    if (fileType === 'coc') {
      setCocPreview(null);
      if (cocInputRef.current) {
        cocInputRef.current.value = '';
      }
    } else {
      setMedicalPreview(null);
      if (medicalInputRef.current) {
        medicalInputRef.current.value = '';
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

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Document Upload</h2>
      <p className="text-gray-600 mb-8">Please upload the required documents for processing.</p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* COC Upload */}
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Certificate of Competency (COC)
            </h3>
            
            <input
              type="file"
              ref={cocInputRef}
              onChange={(e) => handleFileChange(e, 'coc')}
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden"
              required={!formData.coc}
            />
            
            {cocPreview ? (
              <div className="mt-4 text-center">
                <div className="relative inline-block">
                  <img 
                    src={cocPreview} 
                    alt="COC preview" 
                    className="h-40 w-auto border rounded-md object-contain mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile('coc')}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">{getFileName(formData.coc)}</p>
              </div>
            ) : formData.coc ? (
              <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getFileIcon(formData.coc)}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 truncate">{getFileName(formData.coc)}</p>
                      <p className="text-xs text-gray-500">{(formData.coc.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile('coc')}
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
                onClick={() => triggerFileInput('coc')}
                className="flex flex-col items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-blue-500 hover:text-blue-500 mt-4"
              >
                <svg className="w-12 h-12 mx-auto" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="block mt-2 text-sm font-medium">Upload COC Document</span>
                <span className="block text-xs mt-1">JPG, PNG or PDF (Max 5MB)</span>
              </button>
            )}
            
            <div className="mt-4 text-xs text-gray-500">
              <p>• Required for all applicants</p>
              <p>• Must be valid and clearly visible</p>
              <p>• PDF, JPG, or PNG format only</p>
            </div>
          </div>
          
          {/* Medical Report Upload */}
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              Medical Report
            </h3>
            
            <input
              type="file"
              ref={medicalInputRef}
              onChange={(e) => handleFileChange(e, 'medicalReport')}
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden"
              required={!formData.medicalReport}
            />
            
            {medicalPreview ? (
              <div className="mt-4 text-center">
                <div className="relative inline-block">
                  <img 
                    src={medicalPreview} 
                    alt="Medical report preview" 
                    className="h-40 w-auto border rounded-md object-contain mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile('medicalReport')}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">{getFileName(formData.medicalReport)}</p>
              </div>
            ) : formData.medicalReport ? (
              <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getFileIcon(formData.medicalReport)}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 truncate">{getFileName(formData.medicalReport)}</p>
                      <p className="text-xs text-gray-500">{(formData.medicalReport.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile('medicalReport')}
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
                onClick={() => triggerFileInput('medicalReport')}
                className="flex flex-col items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-green-500 hover:text-green-500 mt-4"
              >
                <svg className="w-12 h-12 mx-auto" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="block mt-2 text-sm font-medium">Upload Medical Report</span>
                <span className="block text-xs mt-1">JPG, PNG or PDF (Max 5MB)</span>
              </button>
            )}
            
            <div className="mt-4 text-xs text-gray-500">
              <p>• Must be from an approved medical center</p>
              <p>• Should be issued within the last 3 months</p>
              <p>• Must include all required health tests</p>
            </div>
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
            disabled={!formData.coc || !formData.medicalReport}
          >
            Continue to Visa/Contract
          </button>
        </div>
      </form>
    </div>
  );
}