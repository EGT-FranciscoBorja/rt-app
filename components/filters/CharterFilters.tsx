import React from 'react'

interface CharterFiltersProps {
  onFilterChange: (filters: CharterFilters) => void
}

export interface CharterFilters {
  minPrice: number | null
  maxPrice: number | null
  minPersons: number | null
  maxPersons: number | null
  searchTerm: string
}

export default function CharterFilters({ onFilterChange }: CharterFiltersProps) {
  const [filters, setFilters] = React.useState<CharterFilters>({
    minPrice: null,
    maxPrice: null,
    minPersons: null,
    maxPersons: null,
    searchTerm: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newFilters = {
      ...filters,
      [name]: value === '' ? null : Number(value)
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = {
      ...filters,
      searchTerm: e.target.value
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleSearchChange}
            className="input"
            placeholder="Search by name..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Price
            </label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice || ''}
              onChange={handleChange}
              className="input"
              placeholder="Min price"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Price
            </label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice || ''}
              onChange={handleChange}
              className="input"
              placeholder="Max price"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Persons
            </label>
            <input
              type="number"
              name="minPersons"
              value={filters.minPersons || ''}
              onChange={handleChange}
              className="input"
              placeholder="Min persons"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Persons
            </label>
            <input
              type="number"
              name="maxPersons"
              value={filters.maxPersons || ''}
              onChange={handleChange}
              className="input"
              placeholder="Max persons"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 