// File: src/app/components/TicketStatus.tsx
'use client';

import { useState, useRef } from 'react';

interface TicketData {
  status: string;
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  ticketFare: string;
  currency: string;
  ticketNumber: string;
  bookingReference: string;
  ticketDocument?: File | null;
  notes?: string;
}

interface TicketStatusProps {
  onComplete: (data: TicketData) => void;
  onBack: () => void;
}

export default function TicketStatus({ onComplete, onBack }: TicketStatusProps) {
  const [formData, setFormData] = useState<TicketData>({
    status: 'not_booked',
    airline: '',
    flightNumber: '',
    departureAirport: '',
    arrivalAirport: '',
    departureDate: '',
    departureTime: '',
    arrivalDate: '',
    arrivalTime: '',
    ticketFare: '',
    currency: 'USD',
    ticketNumber: '',
    bookingReference: '',
    ticketDocument: null,
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
      setFormData(prev => ({ ...prev, ticketDocument: file }));
      
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
    setFormData(prev => ({ ...prev, ticketDocument: null }));
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
    { value: 'not_booked', label: 'Not Booked', color: 'bg-gray-100 text-gray-800' },
    { value: 'booked', label: 'Booked', color: 'bg-blue-100 text-blue-800' },
    { value: 'issued', label: 'Issued', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-purple-100 text-purple-800' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'AUD', label: 'Australian Dollar (A$)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' },
    { value: 'NPR', label: 'Nepalese Rupee (₨)' },
    { value: 'QAR', label: 'Qatari Riyal (﷼)' },
    { value: 'SAR', label: 'Saudi Riyal (﷼)' },
    { value: 'AED', label: 'UAE Dirham (د.إ)' }
  ];

  const popularAirlines = [
    'Qatar Airways',
    'Emirates',
    'Etihad Airways',
    'Saudi Airlines',
    'Oman Air',
    'Flydubai',
    'Air Arabia',
    'Gulf Air',
    'Kuwait Airways',
    'Turkish Airlines',
    'Air India',
    'IndiGo',
    'SpiceJet',
    'Nepal Airlines',
    'Buddha Air',
    'Yeti Airlines'
  ];

  const popularAirports = [
    'KTM - Tribhuvan International, Kathmandu',
    'DOH - Hamad International, Doha',
    'DXB - Dubai International, Dubai',
    'AUH - Abu Dhabi International, Abu Dhabi',
    'RUH - King Khalid International, Riyadh',
    'JED - King Abdulaziz International, Jeddah',
    'DMM - King Fahd International, Dammam',
    'MCT - Muscat International, Muscat',
    'BAH - Bahrain International, Bahrain',
    'KWI - Kuwait International, Kuwait',
    'IST - Istanbul Airport, Istanbul',
    'DEL - Indira Gandhi International, Delhi',
    'BOM - Chhatrapati Shivaji Maharaj, Mumbai'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Flight Ticket Status</h2>
      <p className="text-gray-600 mb-8">Manage flight ticket booking and details for the client.</p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Flight Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Flight Details</h3>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Ticket Status *
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
              <label htmlFor="airline" className="block text-sm font-medium text-gray-700 mb-1">
                Airline *
              </label>
              <input
                type="text"
                id="airline"
                name="airline"
                value={formData.airline}
                onChange={handleInputChange}
                required={formData.status !== 'not_booked'}
                list="airlineOptions"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter airline name"
              />
              <datalist id="airlineOptions">
                {popularAirlines.map(airline => (
                  <option key={airline} value={airline} />
                ))}
              </datalist>
            </div>
            
            <div>
              <label htmlFor="flightNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Flight Number
              </label>
              <input
                type="text"
                id="flightNumber"
                name="flightNumber"
                value={formData.flightNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter flight number"
              />
            </div>
            
            <div>
              <label htmlFor="departureAirport" className="block text-sm font-medium text-gray-700 mb-1">
                Departure Airport *
              </label>
              <input
                type="text"
                id="departureAirport"
                name="departureAirport"
                value={formData.departureAirport}
                onChange={handleInputChange}
                required={formData.status !== 'not_booked'}
                list="airportOptions"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter departure airport"
              />
              <datalist id="airportOptions">
                {popularAirports.map(airport => (
                  <option key={airport} value={airport} />
                ))}
              </datalist>
            </div>
            
            <div>
              <label htmlFor="arrivalAirport" className="block text-sm font-medium text-gray-700 mb-1">
                Arrival Airport *
              </label>
              <input
                type="text"
                id="arrivalAirport"
                name="arrivalAirport"
                value={formData.arrivalAirport}
                onChange={handleInputChange}
                required={formData.status !== 'not_booked'}
                list="airportOptions"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter arrival airport"
              />
            </div>
          </div>
          
          {/* Date, Time & Fare */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Schedule & Pricing</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Departure Date *
                </label>
                <input
                  type="date"
                  id="departureDate"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleInputChange}
                  required={formData.status !== 'not_booked'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="departureTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Departure Time *
                </label>
                <input
                  type="time"
                  id="departureTime"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleInputChange}
                  required={formData.status !== 'not_booked'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="arrivalDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Arrival Date *
                </label>
                <input
                  type="date"
                  id="arrivalDate"
                  name="arrivalDate"
                  value={formData.arrivalDate}
                  onChange={handleInputChange}
                  required={formData.status !== 'not_booked'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="arrivalTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Arrival Time *
                </label>
                <input
                  type="time"
                  id="arrivalTime"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleInputChange}
                  required={formData.status !== 'not_booked'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="ticketFare" className="block text-sm font-medium text-gray-700 mb-1">
                  Ticket Fare *
                </label>
                <input
                  type="number"
                  id="ticketFare"
                  name="ticketFare"
                  value={formData.ticketFare}
                  onChange={handleInputChange}
                  required={formData.status !== 'not_booked'}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                  Currency *
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  required={formData.status !== 'not_booked'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {currencyOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="ticketNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Ticket Number
              </label>
              <input
                type="text"
                id="ticketNumber"
                name="ticketNumber"
                value={formData.ticketNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter ticket number"
              />
            </div>
            
            <div>
              <label htmlFor="bookingReference" className="block text-sm font-medium text-gray-700 mb-1">
                Booking Reference
              </label>
              <input
                type="text"
                id="bookingReference"
                name="bookingReference"
                value={formData.bookingReference}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter booking reference"
              />
            </div>
          </div>
        </div>
        
        {/* Document Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ticket Document
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
                  alt="Ticket document preview" 
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
              <p className="text-xs text-gray-500 mt-1">{getFileName(formData.ticketDocument)}</p>
            </div>
          ) : formData.ticketDocument ? (
            <div className="mt-2 p-3 border border-gray-200 rounded-md bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getFileIcon(formData.ticketDocument)}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 truncate">{getFileName(formData.ticketDocument)}</p>
                    <p className="text-xs text-gray-500">{(formData.ticketDocument.size / 1024).toFixed(1)} KB</p>
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
              <span className="block mt-2 text-sm font-medium">Upload Ticket Document</span>
              <span className="block text-xs mt-1">JPG, PNG or PDF (Max 5MB)</span>
            </button>
          )}
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
            placeholder="Add any additional notes or comments about the flight ticket..."
          />
        </div>
        
        {/* Flight Summary Preview */}
        {formData.status !== 'not_booked' && (
          <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
            <h4 className="text-sm font-medium text-blue-800 mb-3">Flight Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-blue-600">Route</p>
                <p className="text-sm font-medium">{formData.departureAirport} → {formData.arrivalAirport}</p>
              </div>
              <div>
                <p className="text-xs text-blue-600">Departure</p>
                <p className="text-sm font-medium">
                  {formData.departureDate && new Date(formData.departureDate).toLocaleDateString()} 
                  {formData.departureTime && ` at ${formData.departureTime}`}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-600">Fare</p>
                <p className="text-sm font-medium">
                  {formData.ticketFare && `${formData.currency} ${parseFloat(formData.ticketFare).toLocaleString()}`}
                </p>
              </div>
            </div>
          </div>
        )}
        
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
            Continue to Pregnancy Check
          </button>
        </div>
      </form>
    </div>
  );
}