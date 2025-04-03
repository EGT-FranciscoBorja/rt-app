import React from 'react'

interface HotelRoomFiltersProps {
  filters: {
    name: string
    priceMin: string
    priceMax: string
    capacity: string
  }
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function HotelRoomFilters({ filters, onFilterChange }: HotelRoomFiltersProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={onFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Room name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
          <input
            type="number"
            name="priceMin"
            value={filters.priceMin}
            onChange={onFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Minimum price"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
          <input
            type="number"
            name="priceMax"
            value={filters.priceMax}
            onChange={onFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Maximum price"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
          <input
            type="number"
            name="capacity"
            value={filters.capacity}
            onChange={onFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Minimum capacity"
          />
        </div>
      </div>
    </div>
  )
}

export default HotelRoomFilters 