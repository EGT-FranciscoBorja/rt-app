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
  start_date: string
  end_date: string
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
    days: '',
    start_date: '',
    end_date: ''
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
    const loadDepartures = async () => {
      if (itineraries && itineraries.length > 0) {
        // Limpiar los departures existentes antes de cargar los nuevos
        dispatch({ type: 'departures/clearDepartures' })
        
        // Crear un array de promesas para todas las llamadas de departures
        const departurePromises = itineraries.map(itinerary => 
          dispatch(fetchDepartures({ cruiseId, itineraryId: itinerary.id }))
        )
        
        // Esperar a que todas las promesas se completen
        await Promise.all(departurePromises)
      }
    }

    loadDepartures()
  }, [dispatch, cruiseId, itineraries])

  const calculateDays = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return ''
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays.toString()
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newFormData = {
      ...formData,
      [name]: value
    }
    setFormData(newFormData)

    // Calcular días automáticamente si ambas fechas están presentes
    if (newFormData.start_date && newFormData.end_date) {
      const days = calculateDays(newFormData.start_date, newFormData.end_date)
      setFormData(prev => ({
        ...prev,
        days
      }))
    }
  }

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFormData(prev => ({
      ...prev,
      days: value
    }))

    // Calcular fecha de fin automáticamente si hay fecha de inicio y días
    if (formData.start_date && value) {
      const startDate = new Date(formData.start_date)
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + parseInt(value))
      setFormData(prev => ({
        ...prev,
        end_date: endDate.toISOString().split('T')[0]
      }))
    }
  }

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

        // Crear o actualizar el departure
        if (formData.start_date && formData.end_date) {
          await dispatch(createDeparture({
            cruiseId,
            itineraryId: editingId,
            departureData: {
              start_date: formData.start_date,
              end_date: formData.end_date
            }
          })).unwrap()
        }
      } else {
        const response = await dispatch(createItinerary({
          cruiseId,
          itineraryData: {
            name: formData.name,
            days: parseInt(formData.days)
          }
        })).unwrap()

        // Crear el departure para el nuevo itinerario
        if (formData.start_date && formData.end_date) {
          await dispatch(createDeparture({
            cruiseId,
            itineraryId: response.id,
            departureData: {
              start_date: formData.start_date,
              end_date: formData.end_date
            }
          })).unwrap()
        }
      }
      setFormData({ name: '', days: '', start_date: '', end_date: '' })
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
      days: itinerary.days.toString(),
      start_date: '',
      end_date: ''
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
            setFormData({ name: '', days: '', start_date: '', end_date: '' })
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
                onChange={handleDaysChange}
                className="input"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleDateChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleDateChange}
                className="input"
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
                setFormData({ name: '', days: '', start_date: '', end_date: '' })
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