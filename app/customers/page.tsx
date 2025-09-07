// File: src/app/customers/page.tsx
'use client';

import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import ViewProfilesButton from '../components/ViewProfilesButton';
import { useRouter } from 'next/navigation';

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
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    // Load customers from localStorage
    const savedCustomers = localStorage.getItem('foreignEmploymentCustomers');
    if (savedCustomers) {
      try {
        const parsedCustomers = JSON.parse(savedCustomers);
        setCustomers(parsedCustomers);
        setFilteredCustomers(parsedCustomers);
      } catch (error) {
        console.error('Error parsing customers from localStorage:', error);
        setCustomers([]);
        setFilteredCustomers([]);
      }
    }
  }, []);

  useEffect(() => {
    let results = customers;
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(customer => 
        customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(customer => 
        customer.processStatus === statusFilter
      );
    }
    
    setFilteredCustomers(results);
  }, [searchTerm, statusFilter, customers]);

  const handleEditCustomer = (customer: Customer) => {
    localStorage.setItem('currentCustomer', JSON.stringify(customer));
    router.push('/');
  };

  const handleDeleteCustomer = (id: number) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      const updatedCustomers = customers.filter(customer => customer.id !== id);
      setCustomers(updatedCustomers);
      localStorage.setItem('foreignEmploymentCustomers', JSON.stringify(updatedCustomers));
    }
  };

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Completed</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Pending</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Rejected</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Not Started</span>;
    }
  };

  // Function to get photo URL - handles both File objects and data URLs
  const getPhotoUrl = (photoData: any) => {
    if (!photoData) return null;
    
    // If it's already a data URL (from localStorage)
    if (typeof photoData === 'string' && photoData.startsWith('data:')) {
      return photoData;
    }
    
    // If it's a File object (shouldn't happen after localStorage but just in case)
    if (photoData instanceof File) {
      return URL.createObjectURL(photoData);
    }
    
    // If it's an object with data property (alternative storage approach)
    if (photoData && typeof photoData === 'object' && photoData.data) {
      return photoData.data;
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar currentPage="customers" />
      
      <main className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Customer Management</h1>
            <ViewProfilesButton />
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Customers Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => {
                    const photoUrl = getPhotoUrl(customer.photo);
                    return (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {photoUrl ? (
                                <img 
                                  className="h-10 w-10 rounded-full object-cover" 
                                  src={photoUrl} 
                                  alt={customer.fullName} 
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-500 text-sm">{customer.fullName.charAt(0)}</span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{customer.fullName}</div>
                              <div className="text-sm text-gray-500">{customer.gender}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{customer.email}</div>
                          <div className="text-sm text-gray-500">{customer.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.experienceLevel}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(customer.processStatus)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditCustomer(customer)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No customers found. <button onClick={() => router.push('/')} className="text-blue-600 hover:text-blue-800">Register a new customer</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}