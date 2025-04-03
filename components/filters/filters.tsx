'use client'

import React, { useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface FilterValues {
  name?: string
  country?: string
  city?: string
  category?: string
  priceMin?: string
  priceMax?: string
}

interface FiltersProps {
  onApplyFilters: (filters: FilterValues) => void
}

export default function Filters({ onApplyFilters }: FiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    name: '',
    country: '',
    city: '',
    category: '',
    priceMin: '',
    priceMax: ''
  })
  const [isVisible, setIsVisible] = useState(true)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onApplyFilters(filters)
  }

  const handleReset = () => {
    setFilters({
      name: '',
      country: '',
      city: '',
      category: '',
      priceMin: '',
      priceMax: ''
    })
    onApplyFilters({})
  }

  return (
    <div className={`${isVisible ? 'w-64' : 'w-12'} bg-white rounded-lg shadow-md transition-all duration-300 relative`}>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="absolute -right-3 top-4 bg-white rounded-full p-1 shadow-md hover:bg-gray-50"
      >
        {isVisible ? <FaChevronLeft /> : <FaChevronRight />}
      </button>

      {isVisible && (
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Hotel Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={filters.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Search by name..."
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={filters.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Search by country..."
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={filters.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Search by city..."
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
              >
                <option value="">All Categories</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>

            <div>
              <label htmlFor="priceMin" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Price
              </label>
              <input
                type="number"
                id="priceMin"
                name="priceMin"
                value={filters.priceMin}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Minimum price..."
              />
            </div>

            <div>
              <label htmlFor="priceMax" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Price
              </label>
              <input
                type="number"
                id="priceMax"
                name="priceMax"
                value={filters.priceMax}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Maximum price..."
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
} 