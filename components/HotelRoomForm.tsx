import React from 'react'

export interface HotelRoomFormData {
  name: string
  description: string
  quantity: number
  base_price: number
  maximum_persons: number
}

interface HotelRoomFormProps {
  initialData?: HotelRoomFormData
  onSubmit: (data: HotelRoomFormData) => void
  onCancel: () => void
}

function HotelRoomForm({ initialData, onSubmit, onCancel }: HotelRoomFormProps) {
  const [formData, setFormData] = React.useState<HotelRoomFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    quantity: initialData?.quantity || 1,
    base_price: initialData?.base_price || 0,
    maximum_persons: initialData?.maximum_persons || 1
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: ['quantity', 'base_price', 'maximum_persons'].includes(name) ? Number(value) : value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Room name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Room description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
          min="1"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Number of rooms"
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
          placeholder="Base price per night"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Persons</label>
        <input
          type="number"
          name="maximum_persons"
          value={formData.maximum_persons}
          onChange={handleChange}
          required
          min="1"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Maximum number of persons"
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {initialData ? 'Update Room' : 'Create Room'}
        </button>
      </div>
    </form>
  )
}

export default HotelRoomForm 