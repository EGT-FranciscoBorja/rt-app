import React, { useState } from 'react'
import { Hotel } from '@/app/lib/features/hotels/hotelSlice'

interface EditHotelModalProps {
  hotel: Hotel
  onClose: () => void
  onSave: (hotel: Hotel) => void
}

const EditHotelModal: React.FC<EditHotelModalProps> = ({ hotel, onClose, onSave }) => {
  const [editedHotel, setEditedHotel] = useState<Hotel>(hotel)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(editedHotel)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Hotel</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={editedHotel.name}
              onChange={(e) => setEditedHotel({ ...editedHotel, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={editedHotel.description}
              onChange={(e) => setEditedHotel({ ...editedHotel, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="url"
              value={editedHotel.website}
              onChange={(e) => setEditedHotel({ ...editedHotel, website: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              value={editedHotel.country}
              onChange={(e) => setEditedHotel({ ...editedHotel, country: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              value={editedHotel.city}
              onChange={(e) => setEditedHotel({ ...editedHotel, city: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={editedHotel.location}
              onChange={(e) => setEditedHotel({ ...editedHotel, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Base Price</label>
            <input
              type="number"
              value={editedHotel.base_price}
              onChange={(e) => setEditedHotel({ ...editedHotel, base_price: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="number"
              value={editedHotel.category}
              onChange={(e) => setEditedHotel({ ...editedHotel, category: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-2">
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