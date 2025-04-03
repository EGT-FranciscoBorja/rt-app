'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaRegEdit, FaArrowLeft, FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { usePermissions } from '@/app/hooks/usePermissions'
import { 
  fetchHotelRooms, 
  deleteHotelRoom,
  createHotelRoom,
  updateHotelRoom,
  selectHotelRooms,
  selectHotelRoomsStatus,
  selectHotelRoomsError
} from '@/app/lib/features/hotelRooms/hotelRoomsSlice'
import HotelRoomFilters from '@/components/filters/HotelRoomFilters'
import HotelRoomForm, { HotelRoomFormData } from '@/components/HotelRoomForm'
import HotelSeasons from '@/components/HotelSeasons'

interface HotelRoom {
  id: number
  hotel_id: number
  name: string
  description: string
  quantity: number
  base_price: number
  maximum_persons: number
  created_at: string
  updated_at: string
}

interface CancelPolicy {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
}

interface HotelData {
  id: number
  name: string
  description: string
  website: string
  country: string
  city: string
  location: string
  base_price: number
  category: number
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
  cancel_policies: CancelPolicy[]
}

interface HotelRoomFilters {
  name: string
  priceMin: string
  priceMax: string
  capacity: string
}

export default function HotelRoomsClient({ hotelId }: { hotelId: string }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { canEdit } = usePermissions()
  
  const rooms = useAppSelector(selectHotelRooms)
  const status = useAppSelector(selectHotelRoomsStatus)
  const error = useAppSelector(selectHotelRoomsError)
  const [showFilters, setShowFilters] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingRoom, setEditingRoom] = useState<HotelRoom | null>(null)
  const [hotelData, setHotelData] = useState<HotelData | null>(null)
  const [filters, setFilters] = useState<HotelRoomFilters>({
    name: '',
    priceMin: '',
    priceMax: '',
    capacity: ''
  })

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await fetch(`/api/v1/hotel/${hotelId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
        })
        if (!response.ok) throw new Error('Failed to fetch hotel data')
        const data = await response.json()
        setHotelData(data.data)
      } catch (error) {
        console.error('Error fetching hotel data:', error)
      }
    }

    fetchHotelData()
  }, [hotelId])

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchHotelRooms({ hotelId: parseInt(hotelId), filters }))
    }
  }, [dispatch, status, hotelId, filters])

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDelete = async (roomId: number) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await dispatch(deleteHotelRoom({ hotelId: parseInt(hotelId), roomId })).unwrap()
      } catch (error) {
        console.error('Error deleting room:', error)
      }
    }
  }

  const handleCreateRoom = async (roomData: HotelRoomFormData) => {
    try {
      await dispatch(createHotelRoom({ 
        hotelId: parseInt(hotelId), 
        roomData: { ...roomData, hotel_id: parseInt(hotelId) }
      })).unwrap()
      setShowForm(false)
    } catch (error) {
      console.error('Error creating room:', error)
    }
  }

  const handleUpdateRoom = async (roomData: HotelRoomFormData) => {
    try {
      if (!editingRoom) return
      await dispatch(updateHotelRoom({ 
        hotelId: parseInt(hotelId), 
        roomId: editingRoom.id, 
        roomData 
      })).unwrap()
      setShowForm(false)
      setEditingRoom(null)
    } catch (error) {
      console.error('Error updating room:', error)
    }
  }

  const handleEditRoom = (room: HotelRoom) => {
    setEditingRoom(room)
    setShowForm(true)
  }

  const filteredRooms = rooms.filter(room => {
    if (filters.name && !room.name.toLowerCase().includes(filters.name.toLowerCase())) {
      return false
    }
    if (filters.priceMin && room.base_price < parseFloat(filters.priceMin)) {
      return false
    }
    if (filters.priceMax && room.base_price > parseFloat(filters.priceMax)) {
      return false
    }
    if (filters.capacity && room.maximum_persons < parseInt(filters.capacity)) {
      return false
    }
    return true
  })

  return (
    <div className="flex gap-6 p-6 max-w-[2000px] mx-auto">
      <div className={`${showFilters ? 'w-64' : 'w-12'} bg-white rounded-lg shadow-md transition-all duration-300 relative h-fit`}>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute -right-3 top-4 bg-white rounded-full p-1 shadow-md hover:bg-gray-50"
        >
          {showFilters ? <FaChevronLeft /> : <FaChevronRight />}
        </button>

        {showFilters && (
          <div className="p-4">
            <HotelRoomFilters filters={filters} onFilterChange={handleFilterChange} />
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/listHotels')}
              className="text-gray-600 hover:text-gray-800"
            >
              <FaArrowLeft className="text-2xl" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              {hotelData?.name || 'Hotel Rooms'}
            </h1>
          </div>
          {canEdit && (
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setEditingRoom(null)
                  setShowForm(true)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FaPlus className="text-lg" />
                New Room
              </button>
            </div>
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <h2 className="text-2xl font-bold mb-4">
                {editingRoom ? 'Edit Room' : 'Create New Room'}
              </h2>
              <HotelRoomForm
                initialData={editingRoom || undefined}
                onSubmit={editingRoom ? handleUpdateRoom : handleCreateRoom}
                onCancel={() => {
                  setShowForm(false)
                  setEditingRoom(null)
                }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                {canEdit && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {status === 'loading' ? (
                <tr>
                  <td colSpan={canEdit ? 4 : 3} className="px-6 py-4 text-center text-gray-500">
                    Loading rooms...
                  </td>
                </tr>
              ) : status === 'failed' ? (
                <tr>
                  <td colSpan={canEdit ? 4 : 3} className="px-6 py-4 text-center text-red-500">
                    Error loading rooms
                  </td>
                </tr>
              ) : !Array.isArray(rooms) || rooms.length === 0 ? (
                <tr>
                  <td colSpan={canEdit ? 4 : 3} className="px-6 py-4 text-center text-gray-500">
                    No rooms available
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{room.name}</div>
                      <div className="text-sm text-gray-500">{room.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{room.maximum_persons} persons</div>
                      <div className="text-sm text-gray-500">{room.quantity} rooms</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${room.base_price.toLocaleString()}
                    </td>
                    {canEdit && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditRoom(room)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FaRegEdit className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDelete(room.id)}
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

        {hotelData && <HotelSeasons seasons={hotelData.seasons} />}
      </div>
    </div>
  )
} 