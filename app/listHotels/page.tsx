'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchHotels } from '@/app/lib/features/hotels/hotelSlice'
import { usePermissions } from '@/app/hooks/usePermissions'
import { FaRegEdit, FaDownload, FaCloudUploadAlt, FaArrowLeft } from "react-icons/fa"
import { RiDeleteBin6Line } from "react-icons/ri"
import SearchButton from '@/components/search/searchButton'
import Filters from '@/components/filters/filters'
import { useRouter } from 'next/navigation'
import EditHotelModal from './EditHotelModal'

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

interface Hotel {
  id: number
  name: string
  description: string
  website: string
  country: string
  city: string
  location: string
  base_price: number
  category: number
  created_at: string
  updated_at: string
  seasons: Array<{
    id: number
    name: string
    description: string
    start_date: string
    end_date: string
    percentage: number
    created_at: string
    updated_at: string
  }>
  cancel_policies: Array<{
    id: number
    name: string
    description: string
    days: number
    percentage: number
    created_at: string
    updated_at: string
  }>
}

export default function ListHotelsPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const hotels = useAppSelector((state) => state.hotels.items)
  const status = useAppSelector((state) => state.hotels.status)
  const currentPage = useAppSelector((state) => state.hotels.currentPage)
  const totalPages = useAppSelector((state) => state.hotels.totalPages)
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
    console.log('Applied filters:', filters)
  }

  const handleEdit = (hotel: Hotel) => {
    setEditingHotel({
      ...hotel,
      seasons: hotel.seasons || [],
      cancel_policies: hotel.cancel_policies || []
    })
  }

  const handleDelete = async (hotelId: number) => {
    try {
      const response = await fetch(`/api/hotels/${hotelId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete hotel')
      }

      window.location.reload()
    } catch (error) {
      console.error('Error deleting hotel:', error)
    }
  }

  const handleSaveEdit = async () => {
    setEditingHotel(null)
    window.location.reload()
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
                  Add New Hotel
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <SearchButton />
          </div>

          {activeFilters && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-800">Filtros Activos:</span>
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
                  Limpiar todo
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
                      <td colSpan={canEdit ? 6 : 5} className="px-6 py-4 text-center text-gray-500">
                        Loading hotels...
                      </td>
                    </tr>
                  ) : status === 'failed' ? (
                    <tr>
                      <td colSpan={canEdit ? 6 : 5} className="px-6 py-4 text-center text-red-500">
                        Error loading hotels
                      </td>
                    </tr>
                  ) : !Array.isArray(hotels) || hotels.length === 0 ? (
                    <tr>
                      <td colSpan={canEdit ? 6 : 5} className="px-6 py-4 text-center text-gray-500">
                        No hotels available
                      </td>
                    </tr>
                  ) : (
                    hotels.map((hotel) => (
                      <tr key={hotel.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div 
                            className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                            onClick={() => router.push(`/hotels/${hotel.id}/rooms`)}
                          >
                            {hotel.name}
                          </div>
                          <div className="text-sm text-gray-500">{hotel.city}, {hotel.country}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 line-clamp-2">{hotel.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{hotel.location}</div>
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
                            {hotel.category}
                          </span>
                        </td>
                        {canEdit && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit({
                                  ...hotel,
                                  seasons: [],
                                  cancel_policies: []
                                })}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <FaRegEdit className="text-lg" />
                              </button>
                              <button
                                onClick={() => handleDelete(hotel.id)}
                                className="text-red-600 hover:text-red-900"
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
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-700">
              Showing page {currentPage} of {totalPages}
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
        </div>
        {editingHotel && (
          <EditHotelModal
            hotel={editingHotel}
            onClose={() => setEditingHotel(null)}
            onSave={handleSaveEdit}
          />
        )}
      </div>
    </div>
  )
}
