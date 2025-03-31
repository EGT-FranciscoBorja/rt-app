'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchItineraries, selectItineraries, selectItinerariesStatus, createItinerary, updateItinerary, deleteItinerary } from '@/app/lib/features/itineraries/itinerariesSlice'
import { fetchDepartures, selectDepartures, createDeparture, updateDeparture, deleteDeparture } from '@/app/lib/features/departures/departuresSlice'
import { FaRegEdit, FaPlus, FaTimes } from 'react-icons/fa'
import { RiDeleteBin6Line } from 'react-icons/ri'

interface ItinerariesListProps {
  cruiseId: number
}

interface ApiError {
  status?: number
  message?: string
}

interface ItineraryFormData {
  name: string
  days: string
  departures: Array<{
    start_date: string
    end_date: string
  }>
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
    departures: [{ start_date: '', end_date: '' }]
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
        try {
          // Limpiar los departures existentes antes de cargar los nuevos
          dispatch({ type: 'departures/clearDepartures' })
          
          // Cargar los departures uno por uno para mejor manejo de errores
          for (const itinerary of itineraries) {
            try {
              const result = await dispatch(fetchDepartures({ 
                cruiseId, 
                itineraryId: itinerary.id 
              })).unwrap()
              
              // Si no hay departures, no mostrar error
              if (!result || result.length === 0) {
                continue
              }
            } catch (error: unknown) {
              const apiError = error as ApiError
              // Solo mostrar error si no es un 404 (no encontrado)
              if (apiError?.status !== 404) {
                console.error(`Error loading departures for itinerary ${itinerary.id}:`, error)
              }
              continue
            }
          }
        } catch (error) {
          console.error('Error in loadDepartures:', error)
        }
      }
    }

    // Asegurarse de que el cruiseId sea válido antes de cargar
    if (cruiseId > 0) {
      loadDepartures()
    }
  }, [dispatch, cruiseId, itineraries])

  // Añadir un useEffect adicional para recargar cuando cambia el cruiseId
  useEffect(() => {
    if (cruiseId > 0) {
      dispatch(fetchItineraries(cruiseId))
    }
  }, [dispatch, cruiseId])

  const handleDateChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newDepartures = [...formData.departures]
    newDepartures[index] = {
      ...newDepartures[index],
      [name]: value
    }

    // Si se cambia la fecha de inicio, calcular automáticamente la fecha de fin
    if (name === 'start_date' && value && formData.days) {
      const startDate = new Date(value + 'T00:00:00')
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + parseInt(formData.days) - 1)
      newDepartures[index].end_date = endDate.toISOString().split('T')[0]
    }
    
    // Si es el último departure y tiene fechas, añadir uno nuevo vacío
    if (index === newDepartures.length - 1 && value) {
      newDepartures.push({ start_date: '', end_date: '' })
    }

    const newFormData = {
      ...formData,
      departures: newDepartures
    }
    setFormData(newFormData)
  }

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFormData(prev => ({
      ...prev,
      days: value
    }))

    // Si hay fecha de inicio, actualizar todas las fechas de fin
    if (value) {
      setFormData(prev => ({
        ...prev,
        departures: prev.departures.map(departure => {
          if (departure.start_date) {
            const startDate = new Date(departure.start_date + 'T00:00:00')
            const endDate = new Date(startDate)
            endDate.setDate(startDate.getDate() + parseInt(value) - 1)
            return {
              ...departure,
              end_date: endDate.toISOString().split('T')[0]
            }
          }
          return departure
        })
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
        // Primero actualizar el itinerario
        await dispatch(updateItinerary({
          cruiseId,
          itineraryId: editingId,
          itineraryData: {
            name: formData.name,
            days: parseInt(formData.days)
          }
        })).unwrap()

        // Obtener los departures existentes
        const existingDepartures = departures.filter(d => d.cruise_itinerary_id === editingId)
        
        // Eliminar todos los departures existentes
        for (const existingDeparture of existingDepartures) {
          try {
            await dispatch(deleteDeparture({
              cruiseId,
              itineraryId: editingId,
              departureId: existingDeparture.id
            })).unwrap()
          } catch (error) {
            console.error('Error deleting departure:', error)
          }
        }

        // Crear los nuevos departures
        const validDepartures = formData.departures.filter(d => 
          d.start_date && d.end_date && 
          new Date(d.start_date) <= new Date(d.end_date)
        )

        for (const departure of validDepartures) {
          try {
            await dispatch(createDeparture({
              cruiseId,
              itineraryId: editingId,
              departureData: {
                start_date: departure.start_date,
                end_date: departure.end_date
              }
            })).unwrap()
          } catch (error) {
            console.error('Error creating departure:', error)
            continue
          }
        }

        // Recargar los departures después de actualizar
        await dispatch(fetchDepartures({ 
          cruiseId, 
          itineraryId: editingId 
        })).unwrap()
      } else {
        // Crear nuevo itinerario
        const response = await dispatch(createItinerary({
          cruiseId,
          itineraryData: {
            name: formData.name,
            days: parseInt(formData.days)
          }
        })).unwrap()

        // Crear los departures para el nuevo itinerario
        const validDepartures = formData.departures.filter(d => 
          d.start_date && d.end_date && 
          new Date(d.start_date) <= new Date(d.end_date)
        )

        for (const departure of validDepartures) {
          try {
            await dispatch(createDeparture({
              cruiseId,
              itineraryId: response.id,
              departureData: {
                start_date: departure.start_date,
                end_date: departure.end_date
              }
            })).unwrap()
          } catch (error) {
            console.error('Error creating departure:', error)
            continue
          }
        }
      }
      setFormData({ name: '', days: '', departures: [{ start_date: '', end_date: '' }] })
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
    
    // Buscar todos los departures correspondientes a este itinerario
    const itineraryDepartures = departures.filter(d => d.cruise_itinerary_id === itinerary.id)
    
    // Crear el array de departures con las fechas existentes
    const departuresData = itineraryDepartures.map(departure => {
      // Asegurarse de que las fechas se formateen correctamente
      const startDate = new Date(departure.start_date)
      const endDate = new Date(departure.end_date)
      
      return {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      }
    })
    
    // Añadir un departure vacío para permitir añadir uno nuevo
    departuresData.push({ start_date: '', end_date: '' })
    
    setFormData({
      name: itinerary.name,
      days: itinerary.days.toString(),
      departures: departuresData
    })
  }

  // Función auxiliar para formatear fechas
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
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

  const handleDeleteDeparture = async (index: number) => {
    const newDepartures = formData.departures.filter((_, i) => i !== index)
    setFormData(prev => ({
      ...prev,
      departures: newDepartures
    }))
  }

  const handleAddDeparture = async () => {
    if (!editingId) return

    // Obtener el último departure del formulario (el que está vacío)
    const lastDeparture = formData.departures[formData.departures.length - 1]
    
    // Verificar si tiene fechas válidas
    if (lastDeparture.start_date && lastDeparture.end_date && 
        new Date(lastDeparture.start_date) <= new Date(lastDeparture.end_date)) {
      try {
        // Crear el nuevo departure
        await dispatch(createDeparture({
          cruiseId,
          itineraryId: editingId,
          departureData: {
            start_date: lastDeparture.start_date,
            end_date: lastDeparture.end_date
          }
        })).unwrap()

        // Actualizar el formulario
        setFormData(prev => ({
          ...prev,
          departures: [
            ...prev.departures.slice(0, -1), // Mantener todos excepto el último
            { start_date: '', end_date: '' } // Añadir un nuevo departure vacío
          ]
        }))
      } catch (error) {
        console.error('Error adding departure:', error)
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
            setFormData({ name: '', days: '', departures: [{ start_date: '', end_date: '' }] })
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
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-900">Departures</h3>
              {editingId && (
                <button
                  type="button"
                  onClick={handleAddDeparture}
                  className="btn btn-secondary text-sm"
                >
                  Add Departure
                </button>
              )}
            </div>
            <div className="space-y-4">
              {formData.departures.map((departure, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-lg shadow-sm relative">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      name="start_date"
                      value={departure.start_date}
                      onChange={(e) => handleDateChange(index, e)}
                      className="input"
                      required={index !== formData.departures.length - 1}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      name="end_date"
                      value={departure.end_date}
                      onChange={(e) => handleDateChange(index, e)}
                      className="input"
                      required={index !== formData.departures.length - 1}
                    />
                  </div>
                  {index !== formData.departures.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteDeparture(index)}
                      className="absolute top-2 right-2 text-red-600 hover:text-red-900"
                    >
                      <FaTimes className="text-lg" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false)
                setEditingId(null)
                setFormData({ name: '', days: '', departures: [{ start_date: '', end_date: '' }] })
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
                                {formatDisplayDate(departure.start_date)}
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
                                {formatDisplayDate(departure.end_date)}
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