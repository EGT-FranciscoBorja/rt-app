'use client'

import { useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { Cruise } from './actions'

interface EditCruiseModalProps {
  isOpen: boolean
  onClose: () => void
  cruise: Cruise | null
  onSave: (cruise: Cruise) => void
}

export default function EditCruiseModal({ isOpen, onClose, cruise, onSave }: EditCruiseModalProps) {
  const [formData, setFormData] = useState<Partial<Cruise>>({})

  useEffect(() => {
    if (cruise) {
      setFormData({
        ...cruise,
        category: cruise.category.toString() // Convertir a string para el select
      })
    }
  }, [cruise])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (cruise) {
      const updatedCruise = {
        ...cruise,
        ...formData,
        category: parseInt(formData.category as string) // Convertir de vuelta a número
      }
      onSave(updatedCruise)
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
            <input
              type="number"
              value={formData.capacity || ''}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              className="input"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
            <input
              type="number"
              value={formData.base_price || ''}
              onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) })}
              className="input"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 