'use client'

import { useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { Cruise } from './actions'

interface EditCruiseModalProps {
  isOpen: boolean
  onClose: () => void
  cruise: Cruise | null
  onSave: (cruise: Cruise) => Promise<void>
}

interface FormData {
  name: string;
  description: string;
  website: string;
  capacity: string;
  base_price: string;
  category: string;
}

export default function EditCruiseModal({ isOpen, onClose, cruise, onSave }: EditCruiseModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    website: '',
    capacity: '',
    base_price: '',
    category: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (cruise) {
      setFormData({
        name: cruise.name,
        description: cruise.description,
        website: cruise.website,
        capacity: cruise.capacity.toString(),
        base_price: cruise.base_price.toString(),
        category: cruise.category.toString()
      })
    }
  }, [cruise])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cruise || isSubmitting) return

    setIsSubmitting(true)
    try {
      const updatedCruise = {
        ...cruise,
        ...formData,
        category: Number(formData.category),
        capacity: Number(formData.capacity),
        base_price: Number(formData.base_price)
      }
      await onSave(updatedCruise)
      onClose()
    } catch (error) {
      console.error('Error saving cruise:', error)
      alert('Error saving cruise. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen || !cruise) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Edit Cruise</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              rows={4}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="url"
              value={formData.website || ''}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="input"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              className="input"
              min="1"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
            <input
              type="number"
              value={formData.base_price}
              onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
              className="input"
              min="0"
              step="0.01"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input"
              required
              disabled={isSubmitting}
            >
              <option value="">Select a category</option>
              <option value="1">1 - Basic</option>
              <option value="2">2 - Standard</option>
              <option value="3">3 - Premium</option>
              <option value="4">4 - Luxury</option>
              <option value="5">5 - Ultra Luxury</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 