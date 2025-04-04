'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { 
  fetchHotels, 
  selectHotels, 
  selectHotelsStatus, 
  selectHotelsError,
  selectHotelsPagination 
} from '@/app/lib/features/hotels/hotelSlice'
import { usePermissions } from '@/app/hooks/usePermissions'
import { FaRegEdit, FaDownload, FaCloudUploadAlt, FaArrowLeft } from "react-icons/fa"
import { RiDeleteBin6Line } from "react-icons/ri"
import Filters from '@/components/filters/filters'
import { useRouter } from 'next/navigation'
import EditHotelModal from './EditHotelModal'
import { Hotel } from '@/app/lib/types/hotel'

interface HotelFilters {
  name: string
  country: string
  city: string
  category: string
  priceMin: string
  priceMax: string
}

interface FilterValues {
  name?: string
  country?: string
  city?: string
  category?: string
  priceMin?: string
  priceMax?: string
}

interface SaveHotelPayload {
  name: string
  description: string
  website: string
  country: string
  city: string
  location: string
  base_price: number
  category: number
  seasons: number[]
  cancel_policies: number[]
}

export default function ListHotelsPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const hotels = useAppSelector(selectHotels)
  const status = useAppSelector(selectHotelsStatus)
  const error = useAppSelector(selectHotelsError)
  const { currentPage, totalPages, totalItems } = useAppSelector(selectHotelsPagination)
  const [activeFilters, setActiveFilters] = useState<HotelFilters | null>(null)
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null)
  const { canEdit } = usePermissions()

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchHotels(1))
    }
  }, [dispatch, status])

  const handleApplyFilters = (filters: FilterValues) => {
    setActiveFilters(filters as HotelFilters)
  }

  const filteredHotels = hotels.filter(hotel => {
    if (activeFilters) {
      if (activeFilters.name && !hotel.name.toLowerCase().includes(activeFilters.name.toLowerCase())) {
        return false
      }
      if (activeFilters.country && !hotel.country.toLowerCase().includes(activeFilters.country.toLowerCase())) {
        return false
      }
      if (activeFilters.city && !hotel.city.toLowerCase().includes(activeFilters.city.toLowerCase())) {
        return false
      }
      if (activeFilters.category && hotel.category !== parseInt(activeFilters.category)) {
        return false
      }
      if (activeFilters.priceMin && hotel.base_price < parseFloat(activeFilters.priceMin)) {
        return false
      }
      if (activeFilters.priceMax && hotel.base_price > parseFloat(activeFilters.priceMax)) {
        return false
      }
    }
    return true
  })

  const handleEdit = (hotel: Hotel) => {
    setEditingHotel({
      ...hotel,
      seasons: hotel.seasons || [],
      cancel_policies: hotel.cancel_policies || []
    })
  }

  const handleDelete = async (hotelId: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este hotel?')) {
      return
    }

    try {
      const response = await fetch(`/api/v1/hotel/${hotelId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        }
      })

      if (!response.ok) {
        throw new Error('Error deleting hotel')
      }

      dispatch(fetchHotels(currentPage))
    } catch (error) {
      console.error('Error deleting hotel:', error)
      alert('Error deleting hotel')
    }
  }

  const handleSaveEdit = async (id: number, payload: SaveHotelPayload) => {
    try {
      const response = await fetch(`/api/v1/hotel/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Error updating hotel')
      }

      setEditingHotel(null)
      dispatch(fetchHotels(currentPage))
    } catch (error) {
      console.error('Error updating hotel:', error)
      alert('Error updating hotel')
    }
  }

  return (
    <div className="container py-6">
      <div className="flex gap-6 p-6 max-w-[2000px] mx-auto">
        <Filters onApplyFilters={handleApplyFilters} />
        
        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-800"
              >
                <FaArrowLeft className="text-2xl" />
              </button>
              <h1 className="text-3xl font-bold text-gray-800">Hotel Management</h1>
            </div>
            {canEdit && (
              <div className="flex gap-3">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <FaDownload className="text-lg" />
                  Download Data
                </button>
                <button 
                  onClick={() => router.push('/hotels/new')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <FaCloudUploadAlt className="text-lg" />
                  Add Hotel
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}

          {activeFilters && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-800">Active filters:</span>
                  {Object.entries(activeFilters).map(([key, value]) => 
                    value && (
                      <span key={key} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {key}: {value}
                      </span>
                    )
                  )}
                </div>
                <button 
                  onClick={() => setActiveFilters(null)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    {canEdit && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {status === 'loading' ? (
                    <tr>
                      <td colSpan={canEdit ? 7 : 6} className="px-6 py-4 text-center text-gray-500">
                        Loading hotels...
                      </td>
                    </tr>
                  ) : status === 'failed' ? (
                    <tr>
                      <td colSpan={canEdit ? 7 : 6} className="px-6 py-4 text-center text-red-500">
                        {error || 'Error loading hotels'}
                      </td>
                    </tr>
                  ) : !Array.isArray(hotels) || hotels.length === 0 ? (
                    <tr>
                      <td colSpan={canEdit ? 7 : 6} className="px-6 py-4 text-center text-gray-500">
                        No hotels available
                      </td>
                    </tr>
                  ) : filteredHotels.length === 0 ? (
                    <tr>
                      <td colSpan={canEdit ? 7 : 6} className="px-6 py-4 text-center text-gray-500">
                        No hotels match the selected filters
                      </td>
                    </tr>
                  ) : (
                    filteredHotels.map((hotel) => (
                      <tr key={hotel.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div 
                            className="text-sm font-medium text-blue-600 hover:text-blue-900 cursor-pointer"
                            onClick={() => router.push(`/hotels/${hotel.id}/rooms`)}
                          >
                            {hotel.name}
                          </div>
                          <div className="text-sm text-gray-500">{hotel.city}, {hotel.country}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 line-clamp-2">{hotel.description}</div>
                        </td>
                        <td className="px-6 py-4">
                          {hotel.website ? (
                            <a 
                              href={hotel.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate block max-w-xs"
                            >
                              {hotel.website}
                            </a>
                          ) : (
                            <span className="text-sm text-gray-500">Not available</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{hotel.location || 'Not specified'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${hotel.base_price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            hotel.category === 5 ? 'bg-purple-100 text-purple-800' :
                            hotel.category === 4 ? 'bg-blue-100 text-blue-800' :
                            hotel.category === 3 ? 'bg-green-100 text-green-800' :
                            hotel.category === 2 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {hotel.category} stars
                          </span>
                        </td>
                        {canEdit && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(hotel)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit hotel"
                              >
                                <FaRegEdit className="text-lg" />
                              </button>
                              <button
                                onClick={() => handleDelete(hotel.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete hotel"
                              >
                                <RiDeleteBin6Line className="text-lg" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages} ({totalItems} hotels in total)
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => dispatch(fetchHotels(currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => dispatch(fetchHotels(currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {editingHotel && (
        <EditHotelModal
          hotel={editingHotel}
          onClose={() => setEditingHotel(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  )
}
