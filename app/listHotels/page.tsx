'use client'
import React, { useEffect, useState } from 'react'
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaDownload } from "react-icons/fa6";
import { FaCloudUploadAlt, FaArrowLeft } from "react-icons/fa";
import SearchButton from '@/components/search/searchButton';
import Filters from '@/components/filters/filters';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchHotels } from '@/app/lib/features/hotels/hotelSlice';

interface HotelFilters {
  name: string;
  country: string;
  city: string;
  category: string;
  priceMin: string;
  priceMax: string;
}

interface FilterValues {
  name?: string;
  country?: string;
  city?: string;
  category?: string;
  priceMin?: string;
  priceMax?: string;
}

function ListHotels() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const hotels = useAppSelector((state) => state.hotels.items);
  const status = useAppSelector((state) => state.hotels.status);
  const currentPage = useAppSelector((state) => state.hotels.currentPage);
  const totalPages = useAppSelector((state) => state.hotels.totalPages);
  const [activeFilters, setActiveFilters] = useState<HotelFilters | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchHotels(currentPage));
    }
  }, [dispatch, status, currentPage]);

  const handleApplyFilters = (filters: FilterValues) => {
    setActiveFilters(filters as HotelFilters);
    console.log('Applied filters:', filters);
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchHotels(page));
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {status === 'loading' ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Loading hotels...
                    </td>
                  </tr>
                ) : status === 'failed' ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-red-500">
                      Error loading hotels
                    </td>
                  </tr>
                ) : hotels.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No hotels available
                    </td>
                  </tr>
                ) : (
                  hotels.map((hotel) => (
                    <tr key={hotel.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div 
                          className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                          onClick={() => router.push(`/hotels/${hotel.id}/rooms`)}
                        >
                          {hotel.name}
                        </div>
                        <div className="text-sm text-gray-500">{hotel.city}, {hotel.country}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 line-clamp-2">{hotel.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{hotel.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${hotel.base_price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {hotel.category}
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
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListHotels
