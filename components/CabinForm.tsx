import React, { useState } from 'react'
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa'

export interface CabinFormData {
  name: string
  quantity: string
  base_price: string
}

interface CabinFormProps {
  cruiseId: number
  existingCabins?: Array<{
    id?: number
    name: string
    quantity: string | number
    base_price: string | number
  }>
  onAddCabin: (cabin: CabinFormData) => void
  onDeleteCabin: (id: number) => void
  onEditCabin: (id: number, cabin: CabinFormData) => void
}

function CabinForm({ cruiseId, existingCabins = [], onAddCabin, onDeleteCabin, onEditCabin }: CabinFormProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState<CabinFormData>({
    name: '',
    quantity: '',
    base_price: ''
  })
  const [editingId, setEditingId] = useState<number | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (editingId) {
      onEditCabin(editingId, formData)
    } else {
      onAddCabin(formData)
    }
    setFormData({
      name: '',
      quantity: '',
      base_price: ''
    })
    setEditingId(null)
    setIsFormOpen(false)
  }

  const handleEdit = (cabin: { id?: number, name: string, quantity: string | number, base_price: string | number }) => {
    setFormData({
      name: cabin.name,
      quantity: cabin.quantity.toString(),
      base_price: cabin.base_price.toString()
    })
    setEditingId(cabin.id || 0)
    setIsFormOpen(true)
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingId(null)
    setFormData({
      name: '',
      quantity: '',
      base_price: ''
    })
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Cabins</h2>
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="p-1.5 text-white bg-blue-600 rounded-full hover:bg-blue-700"
        >
          <FaPlus className="text-sm" />
        </button>
      </div>

      {isFormOpen && (
        <div className="p-4 mb-4 bg-white rounded-lg shadow-md">
          <div className="space-y-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="input"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Price</label>
              <input
                type="number"
                name="base_price"
                value={formData.base_price}
                onChange={handleInputChange}
                className="input"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="btn btn-primary"
              >
                {editingId ? 'Update Cabin' : 'Add Cabin'}
              </button>
            </div>
          </div>
        </div>
      )}

      {existingCabins.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {existingCabins.map((cabin) => (
                <tr key={cabin.id || 'temp'} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{cabin.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cabin.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${Number(cabin.base_price).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(cabin)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEdit className="text-lg" />
                      </button>
                      <button
                        type="button"
                        onClick={() => cabin.id && onDeleteCabin(cabin.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No cabins available</p>
      )}
    </div>
  )
}

export default CabinForm 