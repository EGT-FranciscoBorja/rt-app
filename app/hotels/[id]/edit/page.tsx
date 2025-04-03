'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft } from "react-icons/fa"
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchSeasons } from '@/app/lib/features/seasons/seasonSlice'
import { fetchCancelPolicies, selectCancelPolicies, selectCancelPoliciesStatus } from '@/app/lib/features/cancelPolicies/cancelPolicySlice'

interface HotelFormData {
  name: string
  description: string
  website: string
  country: string
  city: string
  location: string
  base_price: string
  category: string
  seasons: number[]
  cancel_policies: number[]
}

interface Season {
  id: number
  name: string
  start_date: string
  end_date: string
  percentage: number
}

interface EditHotelPageProps {
  hotelId: string
}

function EditHotelPageContent({ hotelId }: EditHotelPageProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const seasons = useAppSelector((state) => state.seasons.items)
  const seasonsStatus = useAppSelector((state) => state.seasons.status)
  const cancelPolicies = useAppSelector(selectCancelPolicies)
  const cancelPoliciesStatus = useAppSelector(selectCancelPoliciesStatus)

  const [formData, setFormData] = useState<HotelFormData>({
    name: '',
    description: '',
    website: '',
    country: '',
    city: '',
    location: '',
    base_price: '',
    category: '',
    seasons: [],
    cancel_policies: []
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
    const fetchHotel = async () => {
      try {
        const response = await fetch(`/api/hotels/${hotelId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch hotel')
        }
        const data = await response.json()
        setFormData({
          name: data.name,
          description: data.description,
          website: data.website,
          country: data.country,
          city: data.city,
          location: data.location,
          base_price: data.base_price.toString(),
          category: data.category.toString(),
          seasons: data.seasons?.map((s: Season) => s.id) || [],
          cancel_policies: data.cancel_policies?.map((c: number) => c) || []
        })
      } catch (error) {
        console.error('Error fetching hotel:', error)
      }
    }

    fetchHotel()
  }, [hotelId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSeasonChange = (seasonId: number) => {
    setFormData(prev => ({
      ...prev,
      seasons: prev.seasons.includes(seasonId)
        ? prev.seasons.filter(id => id !== seasonId)
        : [...prev.seasons, seasonId]
    }))
  }

  const handleCancelPolicyChange = (policyId: number) => {
    setFormData(prev => ({
      ...prev,
      cancel_policies: prev.cancel_policies.includes(policyId)
        ? prev.cancel_policies.filter(id => id !== policyId)
        : [...prev.cancel_policies, policyId]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/v1/hotel/${hotelId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          website: formData.website,
          country: formData.country,
          city: formData.city,
          location: formData.location,
          base_price: parseFloat(formData.base_price),
          category: parseInt(formData.category),
          seasons: formData.seasons,
          cancel_policies: formData.cancel_policies
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update hotel')
      }

      router.push('/listHotels')
    } catch (error) {
      console.error('Error updating hotel:', error)
      alert('Error al actualizar el hotel: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    }
  }

  return (
    <div className="container py-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft className="text-2xl" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Edit Hotel</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
              <input
                type="number"
                name="base_price"
                value={formData.base_price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="number"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                min="1"
                max="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seasons</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {seasonsStatus === 'loading' ? (
                <div className="text-gray-500">Loading seasons...</div>
              ) : seasonsStatus === 'failed' ? (
                <div className="text-red-500">Error loading seasons</div>
              ) : (
                seasons.map((season) => (
                  <div key={season.id} className="flex items-center p-4 border rounded-lg">
                    <input
                      type="checkbox"
                      id={`season-${season.id}`}
                      checked={formData.seasons.includes(season.id)}
                      onChange={() => handleSeasonChange(season.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`season-${season.id}`} className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{season.name}</div>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cancellation Policies</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cancelPoliciesStatus === 'loading' ? (
                <div className="text-gray-500">Loading policies...</div>
              ) : cancelPoliciesStatus === 'failed' ? (
                <div className="text-red-500">Error loading policies</div>
              ) : (
                cancelPolicies.map((policy) => (
                  <div key={policy.id} className="flex items-center p-4 border rounded-lg">
                    <input
                      type="checkbox"
                      id={`policy-${policy.id}`}
                      checked={formData.cancel_policies.includes(policy.id)}
                      onChange={() => handleCancelPolicyChange(policy.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`policy-${policy.id}`} className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{policy.name}</div>
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

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Hotel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface PageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function EditHotelPage({ params, searchParams }: PageProps) {
  const [resolvedParams] = await Promise.all([params, searchParams])
  return <EditHotelPageContent hotelId={resolvedParams.id} />
} 