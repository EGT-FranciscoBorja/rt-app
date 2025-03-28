'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchItineraries, selectItineraries, selectItinerariesStatus, createItinerary, updateItinerary, deleteItinerary } from '@/app/lib/features/itineraries/itinerariesSlice'
import { fetchDepartures, selectDepartures, createDeparture, updateDeparture } from '@/app/lib/features/departures/departuresSlice'
import { FaRegEdit, FaPlus, FaTimes } from 'react-icons/fa'
import { RiDeleteBin6Line } from 'react-icons/ri'

interface ItinerariesListProps {
  cruiseId: number
}

interface ItineraryFormData {
  name: string
  days: string
}

interface DepartureFormData {
  start_date: string
  end_date: string
}

function ItinerariesList({ cruiseId }: ItinerariesListProps) {
  const dispatch = useAppDispatch()
  const itineraries = useAppSelector(selectItineraries)
  const departures = useAppSelector(selectDepartures)
  const status = useAppSelector(selectItinerariesStatus)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isAddingDeparture, setIsAddingDeparture] = useState(false)
  const [editingDepartureId, setEditingDepartureId] = useState<number | null>(null)
  const [formData, setFormData] = useState<ItineraryFormData>({
    name: '',
    days: ''
  })
  const [departureFormData, setDepartureFormData] = useState<DepartureFormData>({
    start_date: '',
    end_date: ''
  })

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchItineraries(cruiseId))
    }
  }, [dispatch, status, cruiseId])

  useEffect(() => {
    if (itineraries && itineraries.length > 0) {
      // Fetch departures for each itinerary
      itineraries.forEach(itinerary => {
        dispatch(fetchDepartures({ cruiseId, itineraryId: itinerary.id }))
      })
    }
  }, [dispatch, cruiseId, itineraries])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDepartureInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDepartureFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await dispatch(updateItinerary({
          cruiseId,
          itineraryId: editingId,
          itineraryData: {
            name: formData.name,
            days: parseInt(formData.days)
          }
        })).unwrap()
      } else {
        await dispatch(createItinerary({
          cruiseId,
          itineraryData: {
            name: formData.name,
            days: parseInt(formData.days)
          }
        })).unwrap()
      }
      setFormData({ name: '', days: '' })
      setEditingId(null)
      setIsAdding(false)
    } catch (error) {
      console.error('Error saving itinerary:', error)
    }
  }

  const handleDepartureSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return

    try {
      if (editingDepartureId) {
        await dispatch(updateDeparture({
          cruiseId,
          itineraryId: editingId,
          departureId: editingDepartureId,
          departureData: departureFormData
        })).unwrap()
      } else {
        await dispatch(createDeparture({
          cruiseId,
          itineraryId: editingId,
          departureData: departureFormData
        })).unwrap()
      }
      setDepartureFormData({ start_date: '', end_date: '' })
      setEditingDepartureId(null)
      setIsAddingDeparture(false)
    } catch (error) {
      console.error('Error saving departure:', error)
    }
  }

  const handleEdit = (itinerary: { id: number, name: string, days: number }) => {
    setEditingId(itinerary.id)
    setFormData({
      name: itinerary.name,
      days: itinerary.days.toString()
    })
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this itinerary?')) {
      try {
        await dispatch(deleteItinerary({ cruiseId, itineraryId: id })).unwrap()
      } catch (error) {
        console.error('Error deleting itinerary:', error)
      }
    }
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Cruise Itineraries</h2>
        <button
          onClick={() => {
            setIsAdding(true)
            setEditingId(null)
            setFormData({ name: '', days: '' })
          }}
          className="btn btn-primary flex items-center gap-2"
        >
          <FaPlus />
          Add Itinerary
        </button>
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Days</label>
              <input
                type="number"
                name="days"
                value={formData.days}
                onChange={handleInputChange}
                className="input"
                min="1"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false)
                setEditingId(null)
                setFormData({ name: '', days: '' })
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {editingId ? 'Update' : 'Add'} Itinerary
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>Departures</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {status === 'loading' ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Loading itineraries...
                  </td>
                </tr>
              ) : status === 'failed' ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-red-500">
                    Error loading itineraries
                  </td>
                </tr>
              ) : !Array.isArray(itineraries) || itineraries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No itineraries available
                  </td>
                </tr>
              ) : (
                itineraries.map((itinerary) => (
                  <tr key={itinerary.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{itinerary.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {itinerary.days} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {departures && departures.length > 0 && (
                        <div className="space-y-2">
                          {departures
                            .filter(departure => departure.cruise_itinerary_id === itinerary.id)
                            .map((departure) => (
                              <div key={departure.id} className="text-sm">
                                {new Date(departure.start_date).toLocaleDateString()}
                              </div>
                            ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {departures && departures.length > 0 && (
                        <div className="space-y-2">
                          {departures
                            .filter(departure => departure.cruise_itinerary_id === itinerary.id)
                            .map((departure) => (
                              <div key={departure.id} className="text-sm">
                                {new Date(departure.end_date).toLocaleDateString()}
                              </div>
                            ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(itinerary.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(itinerary.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(itinerary)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaRegEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(itinerary.id)}
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

      {isAddingDeparture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Departure</h3>
              <button
                onClick={() => {
                  setIsAddingDeparture(false)
                  setEditingDepartureId(null)
                  setDepartureFormData({ start_date: '', end_date: '' })
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleDepartureSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={departureFormData.start_date}
                  onChange={handleDepartureInputChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={departureFormData.end_date}
                  onChange={handleDepartureInputChange}
                  className="input"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingDeparture(false)
                    setEditingDepartureId(null)
                    setDepartureFormData({ start_date: '', end_date: '' })
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingDepartureId ? 'Update' : 'Add'} Departure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ItinerariesList 