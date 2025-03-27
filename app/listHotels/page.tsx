'use client'
import React, { useState } from 'react'
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaDownload } from "react-icons/fa6";
import { FaCloudUploadAlt, FaArrowLeft } from "react-icons/fa";
import SearchButton from '@/components/search/searchButton';
import Filters from '@/components/filters/filters';
import { useRouter } from 'next/navigation';

interface HotelFilters {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  priceMin: string;
  priceMax: string;
  rating: string;
}

function ListHotels() {
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState<HotelFilters | null>(null);

  const handleApplyFilters = (filters: HotelFilters) => {
    setActiveFilters(filters);
    console.log('Applied filters:', filters);
  };

  return (
    <div className="flex gap-6 p-6 max-w-[2000px] mx-auto">
      <Filters onApplyFilters={handleApplyFilters} />
      
      <div className="flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-800"
            >
              <FaArrowLeft className="text-2xl" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Hotel Management</h1>
          </div>
          <div className="flex gap-3">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <FaDownload className="text-lg" />
              Download Data
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <FaCloudUploadAlt className="text-lg" />
              Add New Hotel
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <SearchButton />
        </div>

        {activeFilters && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-800">Active Filters:</span>
                {Object.entries(activeFilters).map(([key, value]) => 
                  value && (
                    <span key={key} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {key}: {value}
                    </span>
                  )
                )}
              </div>
              <button 
                onClick={() => setActiveFilters(null)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Grand Hotel</div>
                    <div className="text-sm text-gray-500">ID: #12345</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">123 Main Street</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">New York</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">NY</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">USA</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">+1 234-567-8900</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">info@grandhotel.com</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">www.grandhotel.com</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$299/night</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      4.8
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <FaRegEdit className="text-lg" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <RiDeleteBin6Line className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListHotels
