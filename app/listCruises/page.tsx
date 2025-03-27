'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaPlus, FaArrowLeft } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchCruises, selectCruisesStatus, selectCruises } from '../features/cruises/cruisesSlice'
import CruiseFilters from '@/components/CruiseFilters'
import { ActionButtons, handleEdit, handleDelete } from './actions'
import EditCruiseModal from './EditCruiseModal'
import { Cruise } from '../features/cruises/cruisesSlice'

export default function ListCruisesPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectCruisesStatus)
  const cruises = useAppSelector(selectCruises)
  const [selectedCruise, setSelectedCruise] = useState<Cruise | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [filters, setFilters] = useState({
    search: '',
    website: '',
    minPrice: '',
    maxPrice: '',
    minCapacity: '',
    maxCapacity: '',
    category: '',
  })

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCruises())
    }
  }, [status, dispatch])

  const filteredCruises = cruises.filter(cruise => {
    const matchesSearch = cruise.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         cruise.description.toLowerCase().includes(filters.search.toLowerCase())
    const matchesWebsite = !filters.website || cruise.website.toLowerCase().includes(filters.website.toLowerCase())
    const matchesPrice = (!filters.minPrice || cruise.base_price >= Number(filters.minPrice)) &&
                        (!filters.maxPrice || cruise.base_price <= Number(filters.maxPrice))
    const matchesCapacity = (!filters.minCapacity || cruise.capacity >= Number(filters.minCapacity)) &&
                           (!filters.maxCapacity || cruise.capacity <= Number(filters.maxCapacity))
    const matchesCategory = !filters.category || cruise.category === Number(filters.category)

    return matchesSearch && matchesWebsite && matchesPrice && matchesCapacity && matchesCategory
  })

  const handleEditClick = (cruise: Cruise) => {
    setSelectedCruise(cruise)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este crucero?')) {
      try {
        await handleDelete(id)
        dispatch(fetchCruises())
      } catch (error) {
        console.error('Error deleting cruise:', error)
      }
    }
  }

  const handleSaveEdit = async (cruise: Cruise) => {
    try {
      await handleEdit(cruise)
      dispatch(fetchCruises())
    } catch (error) {
      console.error('Error updating cruise:', error)
    }
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaArrowLeft className="text-2xl" />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Available Cruises</h1>
        </div>
        <button
          onClick={() => router.push('/cruises')}
          className="btn btn-primary w-full md:w-auto flex items-center justify-center gap-2"
        >
          <FaPlus className="text-lg" />
          Add New Cruise
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <CruiseFilters filters={filters} onFilterChange={setFilters} />

        {/* Tabla de Cruceros */}
        <div className="flex-1">
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {status === 'loading' ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                        Loading cruises...
                      </td>
                    </tr>
                  ) : status === 'failed' ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-red-500">
                        Error loading cruises
                      </td>
                    </tr>
                  ) : filteredCruises.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                        No cruises available
                      </td>
                    </tr>
                  ) : (
                    filteredCruises.map((cruise) => (
                      <tr key={cruise.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{cruise.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{cruise.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a href={cruise.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800">
                            {cruise.website}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{cruise.capacity}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${cruise.base_price}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{cruise.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{new Date(cruise.created_at).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <ActionButtons
                            cruise={cruise}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <EditCruiseModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedCruise(null)
        }}
        cruise={selectedCruise}
        onSave={handleSaveEdit}
      />
    </div>
  )
} 