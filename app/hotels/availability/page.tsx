'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { searchAvailability, SearchParams, Hotel, ApiError, PaginatedData } from './actions';

export default function HotelAvailability() {
  const router = useRouter();
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Hotel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginationData, setPaginationData] = useState<PaginatedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Get today's date and 4 days from now
  const today = new Date().toISOString().split('T')[0];
  const fourDaysFromNow = new Date();
  fourDaysFromNow.setDate(fourDaysFromNow.getDate() + 4);
  const fourDaysFromNowStr = fourDaysFromNow.toISOString().split('T')[0];

  const [formData, setFormData] = useState<SearchParams>({
    check_in: today,
    check_out: fourDaysFromNowStr,
    persons: 1,
    category: '',
    price_min: '',
    price_max: '',
    city: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      // Create a new object with only the required parameters
      const params: SearchParams = {
        check_in: formData.check_in,
        check_out: formData.check_out,
        persons: formData.persons,
        city: formData.city
      };

      // Add optional parameters only if they have values
      if (formData.category) params.category = formData.category;
      if (formData.price_min) params.price_min = formData.price_min;
      if (formData.price_max) params.price_max = formData.price_max;

      console.log('Sending params:', params);
      const response = await searchAvailability(params);
      console.log('API Response:', response);

      if (response.success && response.data && response.data.data) {
        console.log('Setting search results:', response.data.data);
        setSearchResults(response.data.data);
        setPaginationData(response.data);
        setCurrentPage(response.data.current_page);
        setTotalPages(response.data.last_page);
      } else {
        console.error('Invalid response structure:', response);
        setError('Invalid response from server');
        setSearchResults([]);
      }
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.response?.data?.message || 'An error occurred while fetching results';
      const errorDetails = apiError.response?.data?.errors;
      console.error('API Error:', apiError);
      setError(errorMessage + (errorDetails ? `\n${JSON.stringify(errorDetails, null, 2)}` : ''));
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePageChange = async (page: number) => {
    setIsLoading(true);
    try {
      // Create a new object with only the required parameters
      const params: SearchParams = {
        check_in: formData.check_in,
        check_out: formData.check_out,
        persons: formData.persons,
        city: formData.city,
        page: page.toString()
      };

      // Add optional parameters only if they have values
      if (formData.category) params.category = formData.category;
      if (formData.price_min) params.price_min = formData.price_min;
      if (formData.price_max) params.price_max = formData.price_max;

      console.log('Sending params:', params);
      const response = await searchAvailability(params);
      console.log('API Response:', response);

      if (response.success && response.data && response.data.data) {
        console.log('Setting search results:', response.data.data);
        setSearchResults(response.data.data);
        setPaginationData(response.data);
        setCurrentPage(response.data.current_page);
        setTotalPages(response.data.last_page);
      } else {
        console.error('Invalid response structure:', response);
        setError('Invalid response from server');
        setSearchResults([]);
      }
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.response?.data?.message || 'An error occurred while fetching results';
      const errorDetails = apiError.response?.data?.errors;
      console.error('API Error:', apiError);
      setError(errorMessage + (errorDetails ? `\n${JSON.stringify(errorDetails, null, 2)}` : ''));
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-6 p-6 max-w-[2000px] mx-auto">
      {/* Filters Section */}
      <div className={`${isFiltersOpen ? 'w-64' : 'w-12'} bg-white p-4 rounded-lg shadow-md transition-all duration-300 relative`}>
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="absolute -right-3 top-4 bg-white rounded-full p-1 shadow-md hover:bg-gray-50"
        >
          {isFiltersOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>

        {isFiltersOpen && (
          <>
            <h2 className="text-lg font-semibold mb-4">Search Filters</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="Enter city name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="check_in"
                  value={formData.check_in}
                  onChange={handleChange}
                  required
                  className="input"
                  min={today}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="check_out"
                  value={formData.check_out}
                  onChange={handleChange}
                  required
                  className="input"
                  min={formData.check_in}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Persons <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="persons"
                  min="1"
                  value={formData.persons}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="Enter number of persons"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">All Categories</option>
                  <option value="1">Basic</option>
                  <option value="2">Standard</option>
                  <option value="3">Premium</option>
                  <option value="4">Luxury</option>
                  <option value="5">Ultra Luxury</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="price_min"
                    value={formData.price_min}
                    onChange={handleChange}
                    className="input"
                    placeholder="Min"
                    min="0"
                    step="0.01"
                  />
                  <input
                    type="number"
                    name="price_max"
                    value={formData.price_max}
                    onChange={handleChange}
                    className="input"
                    placeholder="Max"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Search Availability'}
              </button>
            </form>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-800"
            >
              <FaArrowLeft className="text-2xl" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Hotel Availability</h1>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">Loading available hotels...</p>
          </div>
        ) : (
          <div>
            {searchResults.length > 0 ? (
              <div className="space-y-6">
                {searchResults.map((hotel) => (
                  <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-800">{hotel.name}</h2>
                        <span className="px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800">
                          {hotel.category === 1 && 'Basic'}
                          {hotel.category === 2 && 'Standard'}
                          {hotel.category === 3 && 'Premium'}
                          {hotel.category === 4 && 'Luxury'}
                          {hotel.category === 5 && 'Ultra Luxury'}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-2">{hotel.city}, {hotel.country}</p>
                      <p className="text-gray-600">{hotel.description}</p>
                    </div>
                    
                    <div className="p-6">
                      {hotel.seasons && hotel.seasons.length > 0 && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-blue-800">
                                {hotel.seasons[0].name}
                              </p>
                              <p className="text-xs text-blue-600 mt-1">
                                Valid from {new Date(hotel.seasons[0].start_date).toLocaleDateString()} to {new Date(hotel.seasons[0].end_date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-blue-800">
                                {hotel.seasons[0].percentage}% OFF
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Type</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {hotel.room_types.map((room) => (
                              <tr key={room.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {room.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                  {room.available_quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                  ${room.price.toLocaleString()}
                                  {room.original_price && room.original_price !== room.price && (
                                    <span className="ml-2 text-sm text-red-500 line-through">
                                      (${room.original_price.toLocaleString()})
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : hasSearched ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-600">
                  No hotels found for the selected criteria. Please try different dates or filters.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-600">
                  Use the filters on the left to search for available hotels based on your preferences.
                  Required fields are marked with a red asterisk (*).
                </p>
              </div>
            )}

            {/* Pagination Controls */}
            <div className="mt-6 flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-lg shadow-md">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{paginationData?.from}</span> to{' '}
                    <span className="font-medium">{paginationData?.to}</span> of{' '}
                    <span className="font-medium">{paginationData?.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === page
                            ? 'z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 