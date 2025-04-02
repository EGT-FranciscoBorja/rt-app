'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { searchAvailability, SearchParams, Cruise, ApiError } from './actions';

export default function CruiseAvailability() {
  const router = useRouter();
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Cruise[]>([]);
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
    minPrice: '',
    maxPrice: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const response = await searchAvailability(formData);
      setSearchResults(response.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'An error occurred while fetching results');
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
//    console.log(date);
    return date.toISOString().split('T')[0];
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
                    name="minPrice"
                    value={formData.minPrice}
                    onChange={handleChange}
                    className="input"
                    placeholder="Min"
                    min="0"
                    step="0.01"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    value={formData.maxPrice}
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
            <h1 className="text-3xl font-bold text-gray-800">Cruise Availability</h1>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">Loading available cruises...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-6">
            {searchResults.map((cruise) => (
              <div key={cruise.cruise_id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800">{cruise.cruise_name}</h2>
                </div>
                
                {Object.values(cruise.itineraries).map((itinerary) => (
                  <div key={itinerary.itinerary_id} className="p-6 border-b border-gray-200 last:border-b-0">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">{itinerary.itinerary_name}</h3>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cabin</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {Object.values(itinerary.departures).map((departure) => (
                            Array.isArray(departure.cabins) ? departure.cabins.map((cabin) => (
                              <tr key={`${departure.departure_id}-${cabin.cabin_id}`}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {formatDate(departure.start_date)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {cabin.cabin_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {cabin.available_quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  ${cabin.price.toLocaleString()}
                                </td>
                              </tr>
                            )) : null
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : hasSearched ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">
              No cruises found for the selected criteria. Please try different dates or filters.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">
              Use the filters on the left to search for available cruises based on your preferences.
              Required fields are marked with a red asterisk (*).
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 