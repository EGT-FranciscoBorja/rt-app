import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { MdEmail, MdPhone, MdLanguage } from "react-icons/md";
import { BsCurrencyDollar } from "react-icons/bs";
import { AiFillStar } from "react-icons/ai";

interface FilterValues {
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

interface FiltersProps {
  onApplyFilters: (filters: FilterValues) => void;
}

function Filters({ onApplyFilters }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [filters, setFilters] = useState<FilterValues>({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    priceMin: '',
    priceMax: '',
    rating: '0'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleClear = () => {
    setFilters({
      name: '',
      address: '',
      city: '',
      state: '',
      country: '',
      phone: '',
      email: '',
      website: '',
      priceMin: '',
      priceMax: '',
      rating: '0'
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 transition-all duration-300 ${isOpen ? 'w-80' : 'w-12'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold text-lg ${!isOpen && 'hidden'}`}>Filters</h3>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-6">
          {/* Name Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter hotel name"
            />
          </div>

          {/* Location Filters */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <div className="flex items-center gap-2">
              <IoLocationOutline className="text-gray-400" />
              <input
                type="text"
                name="address"
                value={filters.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Address"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="City"
              />
              <input
                type="text"
                name="state"
                value={filters.state}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="State"
              />
              <input
                type="text"
                name="country"
                value={filters.country}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Country"
              />
            </div>
          </div>

          {/* Contact Filters */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Contact Information</label>
            <div className="flex items-center gap-2">
              <MdPhone className="text-gray-400" />
              <input
                type="text"
                name="phone"
                value={filters.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Phone number"
              />
            </div>
            <div className="flex items-center gap-2">
              <MdEmail className="text-gray-400" />
              <input
                type="email"
                name="email"
                value={filters.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email"
              />
            </div>
            <div className="flex items-center gap-2">
              <MdLanguage className="text-gray-400" />
              <input
                type="text"
                name="website"
                value={filters.website}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Website"
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Price Range</label>
            <div className="flex items-center gap-2">
              <BsCurrencyDollar className="text-gray-400" />
              <div className="flex gap-2 w-full">
                <input
                  type="number"
                  name="priceMin"
                  value={filters.priceMin}
                  onChange={handleChange}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Min"
                />
                <input
                  type="number"
                  name="priceMax"
                  value={filters.priceMax}
                  onChange={handleChange}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Minimum Rating</label>
            <div className="flex items-center gap-2">
              <AiFillStar className="text-yellow-400" />
              <input
                type="range"
                name="rating"
                value={filters.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700">{filters.rating}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>5</span>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={handleClear}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Filters; 