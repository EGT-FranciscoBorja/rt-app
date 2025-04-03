import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchSeasons } from '@/app/lib/features/seasons/seasonSlice'
import { fetchCancelPolicies, selectCancelPolicies, selectCancelPoliciesStatus } from '@/app/lib/features/cancelPolicies/cancelPolicySlice'

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
  seasons: Array<{
    id: number
    name: string
    description: string
    start_date: string
    end_date: string
    percentage: number
  }>
  cancel_policies: Array<{
    id: number
    name: string
    description: string
    days: number
    percentage: number
  }>
}

interface EditHotelModalProps {
  hotel: Hotel
  onClose: () => void
  onSave: (id: number, payload: {
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
  }) => void
}

const EditHotelModal: React.FC<EditHotelModalProps> = ({ hotel, onClose, onSave }) => {
  const dispatch = useAppDispatch()
  const seasons = useAppSelector((state) => state.seasons.items)
  const seasonsStatus = useAppSelector((state) => state.seasons.status)
  const cancelPolicies = useAppSelector(selectCancelPolicies)
  const cancelPoliciesStatus = useAppSelector(selectCancelPoliciesStatus)

  const [editedHotel, setEditedHotel] = useState<Hotel>({
    ...hotel,
    base_price: Number(hotel.base_price),
    category: Number(hotel.category),
    seasons: hotel.seasons || [],
    cancel_policies: hotel.cancel_policies || []
  })

  useEffect(() => {
    if (seasonsStatus === 'idle') {
      dispatch(fetchSeasons(1))
    }
    if (cancelPoliciesStatus === 'idle') {
      dispatch(fetchCancelPolicies(1))
    }
  }, [dispatch, seasonsStatus, cancelPoliciesStatus])

  useEffect(() => {
    if (seasonsStatus === 'succeeded' && hotel.seasons) {
      const updatedSeasons = hotel.seasons.map(season => {
        const fullSeason = seasons.find(s => s.id === season.id)
        return fullSeason || season
      })
      setEditedHotel(prev => ({
        ...prev,
        seasons: updatedSeasons
      }))
    }
  }, [seasonsStatus, seasons, hotel.seasons])

  useEffect(() => {
    if (cancelPoliciesStatus === 'succeeded' && hotel.cancel_policies) {
      const updatedPolicies = hotel.cancel_policies.map(policy => {
        const fullPolicy = cancelPolicies.find(p => p.id === policy.id)
        return fullPolicy || policy
      })
      setEditedHotel(prev => ({
        ...prev,
        cancel_policies: updatedPolicies
      }))
    }
  }, [cancelPoliciesStatus, cancelPolicies, hotel.cancel_policies])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const seasonIds = editedHotel.seasons.map(s => Number(s.id))
      const cancelPolicyIds = editedHotel.cancel_policies.map(p => Number(p.id))
      const payload = {
        name: editedHotel.name,
        description: editedHotel.description,
        website: editedHotel.website,
        country: editedHotel.country,
        city: editedHotel.city,
        location: editedHotel.location,
        base_price: editedHotel.base_price,
        category: editedHotel.category,
        seasons: seasonIds,
        cancel_policies: cancelPolicyIds
      }
      await onSave(hotel.id, payload)
      onClose()
    } catch (error) {
      console.error('Error al guardar el hotel:', error)
    }
  }

  const handleSeasonChange = (seasonId: number) => {
    const season = seasons.find(s => s.id === seasonId)
    if (!season) return

    setEditedHotel(prev => ({
      ...prev,
      seasons: prev.seasons.some(s => s.id === seasonId)
        ? prev.seasons.filter(s => s.id !== seasonId)
        : [...prev.seasons, season]
    }))
  }

  const handleCancelPolicyChange = (policyId: number) => {
    const policy = cancelPolicies.find(p => p.id === policyId)
    if (!policy) return

    setEditedHotel(prev => {
      const isSelected = prev.cancel_policies.some(p => p.id === policyId)
      const newPolicies = isSelected
        ? prev.cancel_policies.filter(p => p.id !== policyId)
        : [...prev.cancel_policies, policy]
      
      return {
        ...prev,
        cancel_policies: newPolicies
      }
    })
  }

  const isSeasonSelected = (seasonId: number) => {
    return editedHotel.seasons.some(s => s.id === seasonId)
  }

  const isPolicySelected = (policyId: number) => {
    return editedHotel.cancel_policies.some(p => p.id === policyId)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Hotel</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={editedHotel.name}
                onChange={(e) => setEditedHotel({ ...editedHotel, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Website</label>
              <input
                type="url"
                value={editedHotel.website}
                onChange={(e) => setEditedHotel({ ...editedHotel, website: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                value={editedHotel.country}
                onChange={(e) => setEditedHotel({ ...editedHotel, country: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                value={editedHotel.city}
                onChange={(e) => setEditedHotel({ ...editedHotel, city: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={editedHotel.location}
                onChange={(e) => setEditedHotel({ ...editedHotel, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Base Price</label>
              <input
                type="number"
                value={editedHotel.base_price}
                onChange={(e) => setEditedHotel({ ...editedHotel, base_price: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="number"
                value={editedHotel.category}
                onChange={(e) => setEditedHotel({ ...editedHotel, category: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={editedHotel.description}
              onChange={(e) => setEditedHotel({ ...editedHotel, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={4}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Seasons</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {seasonsStatus === 'loading' ? (
                <div className="text-gray-500">Loading seasons...</div>
              ) : seasonsStatus === 'failed' ? (
                <div className="text-red-500">Error loading seasons</div>
              ) : (
                seasons.map((season) => (
                  <div 
                    key={season.id} 
                    className={`flex items-center p-4 border rounded-lg transition-colors duration-200 ${
                      isSeasonSelected(season.id)
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={`season-${season.id}`}
                      checked={isSeasonSelected(season.id)}
                      onChange={() => handleSeasonChange(season.id)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor={`season-${season.id}`} className="ml-3 flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900">{season.name}</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(season.start_date).toLocaleDateString()} - {new Date(season.end_date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">Percentage: {season.percentage}%</div>
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Policies</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cancelPoliciesStatus === 'loading' ? (
                <div className="text-gray-500">Loading policies...</div>
              ) : cancelPoliciesStatus === 'failed' ? (
                <div className="text-red-500">Error loading policies</div>
              ) : (
                cancelPolicies.map((policy) => (
                  <div 
                    key={policy.id} 
                    className={`flex items-center p-4 border rounded-lg transition-colors duration-200 ${
                      isPolicySelected(policy.id)
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={`policy-${policy.id}`}
                      checked={isPolicySelected(policy.id)}
                      onChange={() => handleCancelPolicyChange(policy.id)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor={`policy-${policy.id}`} className="ml-3 flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                      </div>
                      <div className="text-xs text-gray-500">{policy.description}</div>
                      <div className="text-xs text-gray-500">
                        Days: {policy.days} | Percentage: {policy.percentage}%
                      </div>
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditHotelModal 