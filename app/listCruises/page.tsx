'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaPlus, FaArrowLeft } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchCruises, selectCruisesStatus, selectCruises } from '../features/cruises/cruisesSlice'
import CruiseFilters from '@/components/CruiseFilters'

export default function ListCruisesPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectCruisesStatus)
  const cruises = useAppSelector(selectCruises)

  const [filters, setFilters] = useState({
    search: '',
    destination: '',
    minPrice: '',
    maxPrice: '',
    minDuration: '',
    maxDuration: '',
    minCapacity: '',
    maxCapacity: '',
  })

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCruises())
    }
  }, [status, dispatch])

  const filteredCruises = cruises.filter(cruise => {
    const matchesSearch = cruise.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         cruise.description.toLowerCase().includes(filters.search.toLowerCase())
    const matchesDestination = !filters.destination || cruise.destination.toLowerCase().includes(filters.destination.toLowerCase())
    const matchesPrice = (!filters.minPrice || cruise.price >= Number(filters.minPrice)) &&
                        (!filters.maxPrice || cruise.price <= Number(filters.maxPrice))
    const duration = parseInt(cruise.duration)
    const matchesDuration = (!filters.minDuration || duration >= Number(filters.minDuration)) &&
                           (!filters.maxDuration || duration <= Number(filters.maxDuration))
    const matchesCapacity = (!filters.minCapacity || cruise.capacity >= Number(filters.minCapacity)) &&
                           (!filters.maxCapacity || cruise.capacity <= Number(filters.maxCapacity))

    return matchesSearch && matchesDestination && matchesPrice && matchesDuration && matchesCapacity
  })

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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival</th>
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
                  ) : filteredCruises.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                        No cruises available
                      </td>
                    </tr>
                  ) : (
                    filteredCruises.map((cruise) => (
                      <tr key={cruise.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{cruise.name}</div>
                          <div className="text-sm text-gray-500">{cruise.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{cruise.destination}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{cruise.duration}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${cruise.price}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{cruise.capacity}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{new Date(cruise.departureDate).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{new Date(cruise.arrivalDate).toLocaleDateString()}</div>
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
    </div>
  )
} 