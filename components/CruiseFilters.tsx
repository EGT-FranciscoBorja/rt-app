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
  const [filters, setFilters] = useState<CruiseFilters>({
    name: '',
    category: '',
    priceMin: '',
    priceMax: '',
    capacityMin: '',
    capacityMax: ''
  })

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleApply = () => {
    onApplyFilters(filters)
  }

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
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                placeholder="Search cruises..."
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="1">Basic</option>
              <option value="2">Standard</option>
              <option value="3">Premium</option>
              <option value="4">Luxury</option>
              <option value="5">Ultra Luxury</option>
            </select>
          </div>

          {/* Rango de Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                name="priceMin"
                value={filters.priceMin}
                onChange={handleFilterChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min"
              />
              <input
                type="number"
                name="priceMax"
                value={filters.priceMax}
                onChange={handleFilterChange}
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
                name="capacityMin"
                value={filters.capacityMin}
                onChange={handleFilterChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min"
              />
              <input
                type="number"
                name="capacityMax"
                value={filters.capacityMax}
                onChange={handleFilterChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max"
              />
            </div>
          </div>

          <button
            onClick={handleApply}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  )
} 