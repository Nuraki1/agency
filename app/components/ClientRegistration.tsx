// File: src/app/components/ClientRegistration.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ViewProfilesButton from './ViewProfilesButton';

interface ClientData {
  fullName: string;
  experienceLevel: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  gender: string;
  passport?: File | null;
  photo?: File | null;
}

interface ClientRegistrationProps {
  onComplete: (data: ClientData) => void;
  showViewProfilesButton?: boolean;
  onBack?: () => void;
}

export default function ClientRegistration({ 
  onComplete, 
  showViewProfilesButton = false, 
  onBack 
}: ClientRegistrationProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ClientData>({
    fullName: '',
    experienceLevel: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
    gender: '',
    passport: null,
    photo: null
  });
  const [passportPreview, setPassportPreview] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const passportInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'passport' | 'photo') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [fileType]: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (fileType === 'passport') {
          setPassportPreview(event.target?.result as string);
        } else {
          setPhotoPreview(event.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const triggerFileInput = (fileType: 'passport' | 'photo') => {
    if (fileType === 'passport' && passportInputRef.current) {
      passportInputRef.current.click();
    } else if (fileType === 'photo' && photoInputRef.current) {
      photoInputRef.current.click();
    }
  };

  const removeFile = (fileType: 'passport' | 'photo') => {
    setFormData(prev => ({ ...prev, [fileType]: null }));
    if (fileType === 'passport') {
      setPassportPreview(null);
      if (passportInputRef.current) {
        passportInputRef.current.value = '';
      }
    } else {
      setPhotoPreview(null);
      if (photoInputRef.current) {
        photoInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Client Registration</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Personal Information</h3>
            
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter full name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter phone number"
              />
            </div>
            
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          {/* Professional Information & Documents */}
          <div className="space-y-4">
            <div>
              <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Experience Level *
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Experience Level</option>
                <option value="beginner">Beginner (0-2 years)</option>
                <option value="intermediate">Intermediate (2-5 years)</option>
                <option value="experienced">Experienced (5+ years)</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter full address"
              />
            </div>
            
            {/* Passport Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passport Copy *
              </label>
              <input
                type="file"
                ref={passportInputRef}
                onChange={(e) => handleFileChange(e, 'passport')}
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
                required={!formData.passport}
              />
              
              {passportPreview ? (
                <div className="mt-2">
                  <div className="relative inline-block">
                    <img 
                      src={passportPreview} 
                      alt="Passport preview" 
                      className="h-32 w-auto border rounded-md object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile('passport')}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Passport uploaded</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => triggerFileInput('passport')}
                  className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-blue-500 hover:text-blue-500"
                >
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="block mt-2">Click to upload passport</span>
                    <span className="block text-xs">JPG, PNG or PDF (Max 5MB)</span>
                  </div>
                </button>
              )}
            </div>
            
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Photo *
              </label>
              <input
                type="file"
                ref={photoInputRef}
                onChange={(e) => handleFileChange(e, 'photo')}
                accept=".jpg,.jpeg,.png"
                className="hidden"
                required={!formData.photo}
              />
              
              {photoPreview ? (
                <div className="mt-2">
                  <div className="relative inline-block">
                    <img 
                      src={photoPreview} 
                      alt="Profile preview" 
                      className="h-32 w-32 border rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile('photo')}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Photo uploaded</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => triggerFileInput('photo')}
                  className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-blue-500 hover:text-blue-500"
                >
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="block mt-2">Click to upload photo</span>
                    <span className="block text-xs">JPG or PNG (Max 2MB)</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <div>
            {showViewProfilesButton && <ViewProfilesButton />}
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-4"
              >
                Back
              </button>
            )}
          </div>
          
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={!formData.passport || !formData.photo}
          >
            Continue to Document Upload
          </button>
        </div>
      </form>
    </div>
  );
}