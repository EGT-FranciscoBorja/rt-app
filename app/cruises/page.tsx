'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaCloudUploadAlt, FaFileUpload, FaTimes } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchCruises, selectCruisesStatus } from '../lib/features/crusies/cruisesSlice'
import UploadModal from '@/components/UploadModal'
import { handleCreateCruise, handleFileUpload } from './actions'

export default function CruisesPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectCruisesStatus)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    capacity: '',
    base_price: '',
    category: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCruises({
        page: 1,
        filters: {
          name: '',
          category: '',
          priceMin: '',
          priceMax: '',
          capacityMin: '',
          capacityMax: ''
        }
      }))
    }
  }, [status, dispatch])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Ensure numeric values are valid
      const capacity = parseInt(formData.capacity)
      const basePrice = parseFloat(formData.base_price)
      const category = parseInt(formData.category)

      if (isNaN(capacity) || isNaN(basePrice) || isNaN(category)) {
        throw new Error('Please enter valid numeric values')
      }

      if (category < 1 || category > 5) {
        throw new Error('Category must be a number between 1 and 5')
      }

      const cruiseData = {
        name: formData.name,
        description: formData.description,
        website: formData.website,
        capacity: capacity,
        base_price: basePrice,
        category: category,
      }

      console.log('Sending data:', cruiseData) // For debugging

      await handleCreateCruise(cruiseData)
      dispatch(fetchCruises({
        page: 1,
        filters: {
          name: '',
          category: '',
          priceMin: '',
          priceMax: '',
          capacityMin: '',
          capacityMax: ''
        }
      }))
      router.push('/listCruises')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating cruise. Please try again.')
      console.error('Error creating cruise:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUploadSubmit = async (file: File) => {
    try {
      await handleFileUpload(file)
      dispatch(fetchCruises({
        page: 1,
        filters: {
          name: '',
          category: '',
          priceMin: '',
          priceMax: '',
          capacityMin: '',
          capacityMax: ''
        }
      }))
      setIsUploadModalOpen(false)
    } catch (err) {
      console.error('Error uploading file:', err)
    }
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Create New Cruise</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="btn btn-primary flex-1 md:flex-none flex items-center justify-center gap-2"
          >
            <FaFileUpload className="text-lg" />
            Upload File
          </button>
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          You can upload an Excel (.xlsx) or CSV (.csv) file with the required format according to the cruises table.
          <a
            href="/assets/demo-cruises.xlsx"
            download
            className="ml-2 text-blue-600 hover:text-blue-800 underline"
          >
            Download example
          </a>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Cruise Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cruise Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="input"
            placeholder="Enter cruise name"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="input"
            placeholder="Enter cruise description"
            required
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="input"
            placeholder="Enter website URL"
            required
          />
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Passenger Capacity</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleInputChange}
            className="input"
            placeholder="Enter passenger capacity"
            required
            min="1"
          />
        </div>

        {/* Base Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
          <input
            type="number"
            name="base_price"
            value={formData.base_price}
            onChange={handleInputChange}
            className="input"
            placeholder="Enter base price"
            required
            min="0"
            step="0.01"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="input"
            required
          >
            <option value="">Select a category</option>
            <option value="1">1 - Basic</option>
            <option value="2">2 - Standard</option>
            <option value="3">3 - Premium</option>
            <option value="4">4 - Luxury</option>
            <option value="5">5 - Ultra Luxury</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="btn btn-secondary w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FaCloudUploadAlt />
            {isSubmitting ? 'Creating...' : 'Create Cruise'}
          </button>
        </div>
      </form>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUploadSubmit}
      />
    </div>
  )
}
