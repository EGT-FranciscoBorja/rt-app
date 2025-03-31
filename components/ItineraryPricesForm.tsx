import React, { useState } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { createPrice, updatePrice, deletePrice } from '@/app/lib/features/itineraries/itinerariesPricesSlice'

interface PriceFormData {
  cruise_cabin_id: number
  price: number
}

interface ItineraryPricesFormProps {
  cruiseId: number
  itineraryId: number
  cabins: Array<{ id: number; name: string }>
  prices: Array<{
    id: number
    cruise_cabin_id: number
    price: number
  }>
}

export default function ItineraryPricesForm({ cruiseId, itineraryId, cabins, prices }: ItineraryPricesFormProps) {
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState<PriceFormData>({
    cruise_cabin_id: 0,
    price: 0
  })
  const [editingId, setEditingId] = useState<number | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : parseInt(value)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await dispatch(updatePrice({
          cruiseId,
          itineraryId,
          priceId: editingId,
          priceData: { price: formData.price }
        })).unwrap()
      } else {
        await dispatch(createPrice({
          cruiseId,
          itineraryId,
          priceData: formData
        })).unwrap()
      }
      setFormData({ cruise_cabin_id: 0, price: 0 })
      setEditingId(null)
    } catch (error) {
      console.error('Error submitting price:', error)
    }
  }

  const handleEdit = (price: { id: number; cruise_cabin_id: number; price: number }) => {
    setFormData({
      cruise_cabin_id: price.cruise_cabin_id,
      price: price.price
    })
    setEditingId(price.id)
  }

  const handleDelete = async (priceId: number) => {
    try {
      await dispatch(deletePrice({
        cruiseId,
        itineraryId,
        priceId
      })).unwrap()
    } catch (error) {
      console.error('Error deleting price:', error)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Prices</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cruise_cabin_id" className="block text-sm font-medium text-gray-700">
              Cabin
            </label>
            <select
              id="cruise_cabin_id"
              name="cruise_cabin_id"
              value={formData.cruise_cabin_id}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select a cabin</option>
              {cabins.map(cabin => (
                <option key={cabin.id} value={cabin.id}>
                  {cabin.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {editingId ? 'Update Price' : 'Add Price'}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <h4 className="text-md font-medium mb-2">Current Prices</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cabin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prices.map(price => {
                const cabin = cabins.find(c => c.id === price.cruise_cabin_id)
                return (
                  <tr key={price.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cabin?.name || 'Unknown Cabin'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${price.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(price)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(price.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 