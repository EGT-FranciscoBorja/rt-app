'use client'

import { useState } from 'react'
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface CruiseFiltersProps {
  onApplyFilters: (filters: CruiseFilters) => void;
}

interface CruiseFilters {
  name: string;
  category: string;
  priceMin: string;
  priceMax: string;
  capacityMin: string;
  capacityMax: string;
}

export default function CruiseFilters({ onApplyFilters }: CruiseFiltersProps) {
  const [isOpen, setIsOpen] = useState(true)

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
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                placeholder="Search cruises..."
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Destino */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <input
              type="text"
              value={filters.destination}
              onChange={(e) => onFilterChange({ ...filters, destination: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter destination"
            />
          </div>

          {/* Rango de Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min"
              />
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Duración */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={filters.minDuration}
                onChange={(e) => onFilterChange({ ...filters, minDuration: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min"
              />
              <input
                type="number"
                value={filters.maxDuration}
                onChange={(e) => onFilterChange({ ...filters, maxDuration: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Capacidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passenger Capacity</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={filters.minCapacity}
                onChange={(e) => onFilterChange({ ...filters, minCapacity: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min"
              />
              <input
                type="number"
                value={filters.maxCapacity}
                onChange={(e) => onFilterChange({ ...filters, maxCapacity: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 