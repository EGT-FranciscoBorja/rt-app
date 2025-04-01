'use client'

import { useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { Cruise } from './actions'
import { useAppDispatch, useAppSelector } from '../hooks'
import { addTempCabin, updateTempCabin, selectTempCabins } from '../lib/features/cabins/cabinsSlice'
import CabinForm from '@/components/CabinForm'

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

interface Cabin {
  id: number;
  name: string;
  quantity: number;
  base_price: number;
  created_at: string;
  updated_at: string;
}

export default function EditCruiseModal({ isOpen, onClose, cruise, onSave }: EditCruiseModalProps) {
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    website: '',
    capacity: '',
    base_price: '',
    category: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingCabins, setExistingCabins] = useState<Cabin[]>([])
  const [isLoadingCabins, setIsLoadingCabins] = useState(false)
  const [deletedCabins, setDeletedCabins] = useState<number[]>([])
  const [editedCabins, setEditedCabins] = useState<{ [key: number]: Cabin }>({})
  const tempCabins = useAppSelector(selectTempCabins)

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
      fetchExistingCabins(cruise.id)
    }
  }, [cruise])

  const fetchExistingCabins = async (cruiseId: number) => {
    setIsLoadingCabins(true)
    try {
      const response = await fetch(`/api/v1/cruise/${cruiseId}/cabin`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      })
      if (!response.ok) throw new Error('Failed to fetch cabins')
      const data = await response.json()
      setExistingCabins(data.data)
    } catch (error) {
      console.error('Error fetching cabins:', error)
    } finally {
      setIsLoadingCabins(false)
    }
  }

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

      // Eliminar las cabinas marcadas para eliminar
      for (const cabinId of deletedCabins) {
        await fetch(`/api/v1/cruise/${cruise.id}/cabin/${cabinId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
        })
      }

      // Actualizar las cabinas existentes que fueron editadas
      for (const [cabinId, cabinData] of Object.entries(editedCabins)) {
        await fetch(`/api/v1/cruise/${cruise.id}/cabin/${cabinId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
          body: JSON.stringify({
            name: cabinData.name,
            quantity: parseInt(cabinData.quantity.toString()),
            base_price: parseFloat(cabinData.base_price.toString()),
          }),
        })
      }

      // Guardar las cabinas temporales
      if (tempCabins.length > 0) {
        for (const cabin of tempCabins) {
          await fetch(`/api/v1/cruise/${cruise.id}/cabin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            },
            body: JSON.stringify({
              name: cabin.name,
              quantity: parseInt(cabin.quantity),
              base_price: parseFloat(cabin.base_price),
            }),
          })
        }
      }

      onClose()
    } catch (error) {
      console.error('Error saving cruise:', error)
      alert('Error saving cruise. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddCabin = (cabinData: { name: string, quantity: string, base_price: string }) => {
    dispatch(addTempCabin(cabinData))
  }

  const handleDeleteCabin = (id: number) => {
    setDeletedCabins(prev => [...prev, id])
  }

  const handleEditCabin = (id: number, cabinData: { name: string, quantity: string, base_price: string }) => {
    // Si la cabina tiene un ID, es una cabina existente
    if (id > 0) {
      const updatedCabin = {
        id,
        name: cabinData.name,
        quantity: parseInt(cabinData.quantity),
        base_price: parseFloat(cabinData.base_price),
        created_at: existingCabins.find(c => c.id === id)?.created_at || '',
        updated_at: new Date().toISOString()
      }
      
      setEditedCabins(prev => ({
        ...prev,
        [id]: updatedCabin
      }))
      
      // Actualizar también en existingCabins para reflejar el cambio inmediatamente
      setExistingCabins(prev => 
        prev.map(cabin => 
          cabin.id === id ? updatedCabin : cabin
        )
      )
    } else {
      // Si no tiene ID, es una cabina temporal
      dispatch(updateTempCabin({ id, ...cabinData }))
    }
  }

  // Filtrar las cabinas existentes para excluir las eliminadas y aplicar las ediciones
  const filteredExistingCabins = existingCabins
    .filter(cabin => !deletedCabins.includes(cabin.id))
    .map(cabin => editedCabins[cabin.id] || cabin)

  // Combinar las cabinas existentes filtradas con las cabinas temporales
  const allCabins = [...filteredExistingCabins, ...tempCabins]

  if (!isOpen || !cruise) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
              onBlur={(e) => setFormData({ ...formData, category: e.target.value })}
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

          {/* Cabins Section */}
          <CabinForm
            existingCabins={isLoadingCabins ? [] : allCabins}
            onAddCabin={handleAddCabin}
            onDeleteCabin={handleDeleteCabin}
            onEditCabin={handleEditCabin}
          />

          <div className="flex justify-end gap-2 pt-4">
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