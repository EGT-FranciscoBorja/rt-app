'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaRegEdit } from "react-icons/fa"
import { RiDeleteBin6Line } from "react-icons/ri"
import { FaDownload } from "react-icons/fa6"
import { FaCloudUploadAlt, FaArrowLeft, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchCruises, selectCruisesStatus, selectCruises, selectPagination } from '../features/cruises/cruisesSlice'
import EditCruiseModal from './EditCruiseModal'
import { handleEdit, handleDelete } from './actions'

interface CruiseFilters {
  name: string
  category: string
  priceMin: string
  priceMax: string
  capacityMin: string
  capacityMax: string
}

export default function ListCruisesPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectCruisesStatus)
  const cruises = useAppSelector(selectCruises)
  const pagination = useAppSelector(selectPagination)
  const [currentPage, setCurrentPage] = useState(1)
  const [editingCruise, setEditingCruise] = useState<Cruise | null>(null)
  const [isFiltersOpen, setIsFiltersOpen] = useState(true)
  const [filters, setFilters] = useState<CruiseFilters>({
    name: '',
    category: '',
    priceMin: '',
    priceMax: '',
    capacityMin: '',
    capacityMax: ''
  })
  const [activeFilters, setActiveFilters] = useState<CruiseFilters>({
    name: '',
    category: '',
    priceMin: '',
    priceMax: '',
    capacityMin: '',
    capacityMax: ''
  })

  useEffect(() => {
    dispatch(fetchCruises({
      page: currentPage,
      filters: activeFilters
    }))
  }, [dispatch, currentPage, activeFilters])

  const handleEditClick = (cruise: Cruise) => {
    setEditingCruise(cruise)
  }

  const handleDeleteClick = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this cruise?')) {
      try {
        await handleDelete(id)
        dispatch(fetchCruises({
          page: currentPage,
          filters: activeFilters
        }))
      } catch (error) {
        console.error('Error deleting cruise:', error)
      }
    }
  }

  const handleSaveEdit = async (updatedCruise: Cruise) => {
    try {
      await handleEdit(updatedCruise)
      dispatch(fetchCruises({
        page: currentPage,
        filters: activeFilters
      }))
      setEditingCruise(null)
    } catch (error) {
      console.error('Error updating cruise:', error)
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleApplyFilters = () => {
    setActiveFilters(filters)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setFilters({
      name: '',
      category: '',
      priceMin: '',
      priceMax: '',
      capacityMin: '',
      capacityMax: ''
    })
    setActiveFilters({
      name: '',
      category: '',
      priceMin: '',
      priceMax: '',
      capacityMin: '',
      capacityMax: ''
    })
    setCurrentPage(1)
  }

  const handleRemoveFilter = (filterName: keyof CruiseFilters) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: ''
    }))
    setActiveFilters(prev => ({
      ...prev,
      [filterName]: ''
    }))
    setCurrentPage(1)
  }

  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5
    const halfMaxPages = Math.floor(maxVisiblePages / 2)

    let startPage = Math.max(1, pagination.current_page - halfMaxPages)
    const endPage = Math.min(pagination.last_page, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    if (pagination.current_page > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => setCurrentPage(pagination.current_page - 1)}
          className="px-3 py-1 text-gray-600 hover:text-gray-900"
        >
          Previous
        </button>
      )
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 rounded ${
            i === pagination.current_page
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {i}
        </button>
      )
    }

    if (pagination.current_page < pagination.last_page) {
      pages.push(
        <button
          key="next"
          onClick={() => setCurrentPage(pagination.current_page + 1)}
          className="px-3 py-1 text-gray-600 hover:text-gray-900"
        >
          Next
        </button>
      )
    }

    return pages
  }

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
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            
            {/* Active Filters Display */}
            {Object.entries(activeFilters).some(([, value]) => value) && (
              <div className="mb-4 p-2 bg-gray-50 rounded">
                <p className="text-sm text-gray-600 mb-2">Active Filters:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(activeFilters).map(([key, value]) => 
                    value && (
                      <span key={key} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {key === 'name' ? 'Name' : 
                         key === 'category' ? 'Category' : 
                         key === 'priceMin' ? 'Min Price' : 
                         key === 'priceMax' ? 'Max Price' : 
                         key === 'capacityMin' ? 'Min Capacity' : 
                         'Max Capacity'}: {value}
                        <button
                          onClick={() => handleRemoveFilter(key as keyof CruiseFilters)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  className="input"
                  placeholder="Search by name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
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
                    name="priceMin"
                    value={filters.priceMin}
                    onChange={handleFilterChange}
                    className="input"
                    placeholder="Min"
                    min="0"
                    step="0.01"
                  />
                  <input
                    type="number"
                    name="priceMax"
                    value={filters.priceMax}
                    onChange={handleFilterChange}
                    className="input"
                    placeholder="Max"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="capacityMin"
                    value={filters.capacityMin}
                    onChange={handleFilterChange}
                    className="input"
                    placeholder="Min"
                    min="1"
                  />
                  <input
                    type="number"
                    name="capacityMax"
                    value={filters.capacityMax}
                    onChange={handleFilterChange}
                    className="input"
                    placeholder="Max"
                    min="1"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleApplyFilters}
                  className="btn btn-primary flex-1"
                >
                  Apply Filters
                </button>
                <button
                  onClick={handleClearFilters}
                  className="btn btn-secondary"
                >
                  Clear
                </button>
              </div>
            </div>
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
            <h1 className="text-3xl font-bold text-gray-800">Cruise Management</h1>
          </div>
          <div className="flex gap-3">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <FaDownload className="text-lg" />
              Download Data
            </button>
            <button 
              onClick={() => router.push('/cruises')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaCloudUploadAlt className="text-lg" />
              Add New Cruise
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {status === 'loading' ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Loading cruises...
                    </td>
                  </tr>
                ) : status === 'failed' ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-red-500">
                      Error loading cruises
                    </td>
                  </tr>
                ) : !Array.isArray(cruises) || cruises.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No cruises available
                    </td>
                  </tr>
                ) : (
                  cruises.map((cruise) => (
                    <tr key={cruise.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{cruise.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 line-clamp-2">{cruise.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a href={cruise.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800">
                          {cruise.website}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cruise.capacity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${cruise.base_price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          cruise.category === 5 ? 'bg-purple-100 text-purple-800' :
                          cruise.category === 4 ? 'bg-blue-100 text-blue-800' :
                          cruise.category === 3 ? 'bg-green-100 text-green-800' :
                          cruise.category === 2 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {cruise.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(cruise)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FaRegEdit className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(cruise.id)}
                            className="text-red-600 hover:text-red-900"
                          >
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
        </div>

        {/* Pagination */}
        {status === 'succeeded' && pagination.last_page > 1 && (
          <div className="mt-4 flex justify-center items-center gap-2">
            {renderPagination()}
          </div>
        )}
      </div>

      {editingCruise && (
        <EditCruiseModal
          isOpen={!!editingCruise}
          onClose={() => setEditingCruise(null)}
          cruise={editingCruise}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  )
} 