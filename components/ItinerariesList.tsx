'use client'

import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchItineraries, selectItineraries, selectItinerariesStatus, createItinerary, updateItinerary, deleteItinerary } from '@/app/lib/features/itineraries/itinerariesSlice'
import { fetchDepartures, selectDepartures, createDeparture, updateDeparture, deleteDeparture } from '@/app/lib/features/departures/departuresSlice'
import { fetchPrices, selectPrices, updatePrice } from '@/app/lib/features/itineraries/itinerariesPricesSlice'
import { fetchCabins, selectCabins, selectCabinsStatus } from '@/app/lib/features/cabins/cabinsSlice'
import { FaRegEdit, FaPlus, FaTimes } from 'react-icons/fa'
import { RiDeleteBin6Line } from 'react-icons/ri'
import Link from 'next/link'
import ItineraryPricesForm from './ItineraryPricesForm'

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
  prices: Array<{
    cruise_cabin_id: number
    price: number
  }>
}

interface DepartureFormData {
  start_date: string
  end_date: string
}

interface Price {
  id: number
  cruise_cabin_id: number
  cruise_itinerary_id: number
  price: number
  created_at: string
  updated_at: string
}

function ItinerariesList({ cruiseId }: ItinerariesListProps) {
  const dispatch = useAppDispatch()
  const itineraries = useAppSelector(selectItineraries)
  const departures = useAppSelector(selectDepartures)
  const prices = useAppSelector(selectPrices)
  const cabins = useAppSelector(selectCabins)
  const cabinsStatus = useAppSelector(selectCabinsStatus)
  const status = useAppSelector(selectItinerariesStatus)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isAddingDeparture, setIsAddingDeparture] = useState(false)
  const [editingDepartureId, setEditingDepartureId] = useState<number | null>(null)
  const [formData, setFormData] = useState<ItineraryFormData>({
    name: '',
    days: '',
    departures: [{ start_date: '', end_date: '' }],
    prices: []
  })
  const [editingPrices, setEditingPrices] = useState<Price[]>([])
  const [departureFormData, setDepartureFormData] = useState<DepartureFormData>({
    start_date: '',
    end_date: ''
  })
  const [selectedItinerary, setSelectedItinerary] = useState<{ id: number; name: string; days: number } | null>(null)
  const [showPricesForm, setShowPricesForm] = useState(false)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchItineraries(cruiseId))
    }
  }, [dispatch, status, cruiseId])

  useEffect(() => {
    const loadDepartures = async () => {
      if (itineraries && itineraries.length > 0) {
        try {
          // Clear existing departures before loading new ones
          dispatch({ type: 'departures/clearDepartures' })
          
          // Load departures one by one for better error handling
          for (const itinerary of itineraries) {
            try {
              const result = await dispatch(fetchDepartures({ 
                cruiseId, 
                itineraryId: itinerary.id 
              })).unwrap()
              
              // If no departures, don't show error
              if (!result || result.length === 0) {
                continue
              }
            } catch (error: unknown) {
              const apiError = error as ApiError
              // Only show error if not 404 (not found)
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

    // Make sure cruiseId is valid before loading
    if (cruiseId > 0) {
      loadDepartures()
    }
  }, [dispatch, cruiseId, itineraries])

  useEffect(() => {
    const loadPrices = async () => {
      if (itineraries && itineraries.length > 0 && cabinsStatus === 'succeeded' && cabins.length > 0) {
        try {
          console.log('Starting price loading...')
          // Clear existing prices before loading new ones
          dispatch({ type: 'itinerariesPrices/clearPrices' })
          
          // Load prices for each itinerary
          for (const itinerary of itineraries) {
            try {
              console.log(`Loading prices for itinerary ${itinerary.id}`)
              const result = await dispatch(fetchPrices({ 
                cruiseId, 
                itineraryId: itinerary.id 
              })).unwrap()
              
              if (!result || result.length === 0) {
                console.log(`No prices for itinerary ${itinerary.id}`)
                continue
              }

              // Log the prices received from the API
              console.log(`Prices received for itinerary ${itinerary.id}:`, result)

              // Verify prices were added correctly to state
              if (Array.isArray(result)) {
                result.forEach(price => {
                  const cabin = cabins.find(c => c.id === price.cruise_cabin_id)
                  console.log(`Price added to state:`, {
                    id: price.id,
                    cabin_id: price.cruise_cabin_id,
                    cabin_name: cabin?.name || 'Not found',
                    itinerary_id: price.cruise_itinerary_id,
                    price: price.price
                  })
                })
              }
            } catch (error: unknown) {
              const apiError = error as ApiError
              if (apiError?.status !== 404) {
                console.error(`Error loading prices for itinerary ${itinerary.id}:`, error)
              }
              continue
            }
          }
        } catch (error) {
          console.error('Error in loadPrices:', error)
        }
      }
    }

    if (cruiseId > 0) {
      loadPrices()
    }
  }, [dispatch, cruiseId, itineraries, cabinsStatus, cabins])

  // Añadir un useEffect para debug específico de precios
  useEffect(() => {
    console.log('=== PRICES DEBUG ===')
    console.log('Prices array:', prices)
    console.log('Prices length:', prices?.length)
    console.log('First price:', prices?.[0])
    console.log('Cabins status:', cabinsStatus)
    console.log('Cabins:', cabins)
    console.log('Itineraries:', itineraries)
  }, [prices, cabinsStatus, cabins, itineraries])

  // Añadir un console.log para debug
  useEffect(() => {
    console.log('=== DEBUG INFO ===')
    console.log('Current prices:', prices)
    console.log('Current cabins:', cabins)
    console.log('Cabins status:', cabinsStatus)
    console.log('Current itineraries:', itineraries)
    
    // Specific debug for prices and cabins
    if (prices && prices.length > 0 && cabins && cabins.length > 0) {
      console.log('=== PRICES AND CABINS MATCHING ===')
      prices.forEach(price => {
        const cabin = cabins.find(c => c.id === price.cruise_cabin_id)
        console.log(`Price ID: ${price.id}`)
        console.log(`- Cruise Cabin ID: ${price.cruise_cabin_id}`)
        console.log(`- Cabin found:`, cabin)
        console.log(`- Cabin name: ${cabin?.name || 'Not found'}`)
        console.log(`- Price: ${price.price}`)
        console.log('---')
      })
    } else {
      console.log('No prices or cabins available for matching')
    }
  }, [prices, cabins, cabinsStatus, itineraries])

  useEffect(() => {
    if (cruiseId > 0) {
      dispatch(fetchCabins(cruiseId))
    }
  }, [dispatch, cruiseId])

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

    // If start date changes, automatically calculate end date
    if (name === 'start_date' && value && formData.days) {
      const startDate = new Date(value + 'T00:00:00')
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + parseInt(formData.days) - 1)
      newDepartures[index].end_date = endDate.toISOString().split('T')[0]
    }
    
    // If it's the last departure and has dates, add a new empty one
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

    // If there's a start date, update all end dates
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
        // First update the itinerary
        await dispatch(updateItinerary({
          cruiseId,
          itineraryId: editingId,
          itineraryData: {
            name: formData.name,
            days: parseInt(formData.days)
          }
        })).unwrap()

        // Get existing departures
        const existingDepartures = departures.filter(d => d.cruise_itinerary_id === editingId)
        
        // Delete all existing departures
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

        // Create new departures
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

        // Update prices
        for (const price of editingPrices) {
          try {
            const priceToUpdate = {
              priceId: price.id,
              priceData: { price: price.price }
            }
            console.log('Updating price:', priceToUpdate)
            await dispatch(updatePrice(priceToUpdate)).unwrap()
          } catch (error) {
            console.error('Error updating price:', error)
            continue
          }
        }

        // Reload departures and prices after updating
        await dispatch(fetchDepartures({ 
          cruiseId, 
          itineraryId: editingId 
        })).unwrap()

        await dispatch(fetchPrices({ 
          cruiseId, 
          itineraryId: editingId 
        })).unwrap()
      } else {
        // Create new itinerary
        const response = await dispatch(createItinerary({
          cruiseId,
          itineraryData: {
            name: formData.name,
            days: parseInt(formData.days)
          }
        })).unwrap()

        // Create departures for the new itinerary
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
      setFormData({ name: '', days: '', departures: [{ start_date: '', end_date: '' }], prices: [] })
      setEditingPrices([])
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
    
    // Find all departures for this itinerary
    const itineraryDepartures = departures.filter(d => d.cruise_itinerary_id === itinerary.id)
    
    // Create departures array with existing dates
    const departuresData = itineraryDepartures.map(departure => {
      // Make sure dates are formatted correctly
      const startDate = new Date(departure.start_date)
      const endDate = new Date(departure.end_date)
      
      return {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      }
    })
    
    // Add an empty departure to allow adding a new one
    departuresData.push({ start_date: '', end_date: '' })
    
    // Set the current prices for editing
    setEditingPrices(prices.filter(p => p.cruise_itinerary_id === itinerary.id))
    
    setFormData({
      name: itinerary.name,
      days: itinerary.days.toString(),
      departures: departuresData,
      prices: []
    })
  }

  // Helper function to format dates
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString('en-US', {
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

    // Get the last departure from the form (the empty one)
    const lastDeparture = formData.departures[formData.departures.length - 1]
    
    // Check if it has valid dates
    if (lastDeparture.start_date && lastDeparture.end_date && 
        new Date(lastDeparture.start_date) <= new Date(lastDeparture.end_date)) {
      try {
        // Create the new departure
        await dispatch(createDeparture({
          cruiseId,
          itineraryId: editingId,
          departureData: {
            start_date: lastDeparture.start_date,
            end_date: lastDeparture.end_date
          }
        })).unwrap()

        // Update the form
        setFormData(prev => ({
          ...prev,
          departures: [
            ...prev.departures.slice(0, -1), // Keep all except the last one
            { start_date: '', end_date: '' } // Add a new empty departure
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
            setFormData({ name: '', days: '', departures: [{ start_date: '', end_date: '' }], prices: [] })
          }}
          className="btn btn-primary flex items-center gap-2"
        >
          <FaPlus />
          Add Itinerary
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Edit Itinerary</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-4" onClick={(e) => e.stopPropagation()}>
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
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg relative">
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

                <div className="mt-6">
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Prices</h3>
                    <ItineraryPricesForm
                      itineraryId={editingId || 0}
                      cabins={cabins.map((cabin) => ({
                        id: cabin.id,
                        name: cabin.name
                      }))}
                      prices={prices.filter(p => p.cruise_itinerary_id === editingId)}
                      onPricesChange={(newPrices) => {
                        console.log('Nuevos precios recibidos:', newPrices)
                        setEditingPrices(newPrices)
                      }}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departures</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prices</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cabins</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
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
                      <div className="text-sm font-medium text-gray-900">
                        <Link 
                          href={`/charters?cruiseId=${cruiseId}&itineraryId=${itinerary.id}`}
                          className="text-indigo-600 hover:text-indigo-900 hover:underline"
                        >
                          {itinerary.name}
                        </Link>
                      </div>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        {cabinsStatus === 'loading' ? (
                          <span className="text-gray-400 text-sm">Loading cabins...</span>
                        ) : cabins && cabins.length > 0 ? (
                          cabins.map(cabin => (
                            <div key={cabin.id} className="text-sm">
                              {cabin.name}
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">No cabins available</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        {cabinsStatus === 'loading' ? (
                          <span className="text-gray-400 text-sm">Loading prices...</span>
                        ) : cabins && cabins.length > 0 ? (
                          cabins.map(cabin => {
                            const price = prices.find(p => 
                              p.cruise_itinerary_id === itinerary.id && 
                              p.cruise_cabin_id === cabin.id
                            )
                            return (
                              <div key={cabin.id} className="text-sm text-green-600">
                                {price && typeof price.price === 'number' ? `$${price.price.toFixed(2)}` : '-'}
                              </div>
                            )
                          })
                        ) : (
                          <span className="text-gray-400 text-sm">No cabins available</span>
                        )}
                      </div>
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

      {showPricesForm && selectedItinerary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Manage Prices - {selectedItinerary.name}</h3>
              <button
                onClick={() => {
                  setShowPricesForm(false)
                  setSelectedItinerary(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <ItineraryPricesForm
              itineraryId={selectedItinerary.id}
              cabins={cabins}
              prices={prices.filter(p => p.cruise_itinerary_id === selectedItinerary.id)}
              onPricesChange={(newPrices) => {
                setEditingPrices(newPrices)
              }}
            />
          </div>
        </div>
      )}

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