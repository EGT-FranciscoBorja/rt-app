import React, { useState, useEffect } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { updatePrice } from '@/app/lib/features/itineraries/itinerariesPricesSlice'

interface Price {
  id: number
  cruise_cabin_id: number
  cruise_itinerary_id: number
  price: number
  created_at: string
  updated_at: string
}

interface ItineraryPricesFormProps {
  itineraryId: number
  cabins: Array<{ id: number; name: string }>
  prices: Price[]
  onPricesChange: (prices: Price[]) => void
}

export default function ItineraryPricesForm({ itineraryId, cabins, prices, onPricesChange }: ItineraryPricesFormProps) {
  const dispatch = useAppDispatch()
  const [editingPrices, setEditingPrices] = useState<Price[]>(prices)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Actualizar editingPrices cuando cambian los precios prop
  useEffect(() => {
    console.log('Precios recibidos:', prices)
    console.log('ID del itinerario:', itineraryId)
    setEditingPrices(prices)
  }, [prices, itineraryId])

  const handlePriceChange = (priceId: number, newPrice: string) => {
    // Permitir cualquier valor durante la edición
    setEditingPrices(prevPrices => 
      prevPrices.map(price => 
        price.id === priceId ? { ...price, price: newPrice === '' ? 0 : parseFloat(newPrice) } : price
      )
    )
  }

  const handleEdit = (priceId: number) => {
    console.log('Editando precio:', priceId)
    setEditingId(priceId)
  }

  const handleSave = async () => {
    if (!editingId || isSaving) return

    const priceToUpdate = editingPrices.find(p => p.id === editingId)
    if (!priceToUpdate) {
      console.error('No se encontró el precio a actualizar:', editingId)
      return
    }

    // Validar que el precio sea un número válido y positivo
    if (isNaN(priceToUpdate.price) || priceToUpdate.price <= 0) {
      alert('El precio debe ser un número positivo')
      return
    }

    setIsSaving(true)
    try {
      // Asegurarse de que el precio sea un número
      const numericPrice = Number(priceToUpdate.price)
      
      console.log('Datos del precio a actualizar:', {
        priceId: priceToUpdate.id,
        price: numericPrice,
        originalPrice: priceToUpdate
      })
      
      const result = await dispatch(updatePrice({
        priceId: priceToUpdate.id,
        priceData: { price: numericPrice }
      })).unwrap()
      
      console.log('Precio actualizado exitosamente:', result)
      
      // Actualizar el estado local con el precio actualizado
      setEditingPrices(prevPrices => 
        prevPrices.map(price => 
          price.id === editingId ? result : price
        )
      )
      
      setEditingId(null)
      onPricesChange(editingPrices)
    } catch (error: unknown) {
      console.error('Error updating price:', error)
      console.error('Datos que causaron el error:', {
        priceId: priceToUpdate.id,
        itineraryId,
        price: priceToUpdate.price
      })
      
      // Mostrar mensaje de error al usuario
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('Error al actualizar el precio')
      }
      
      // Revertir el cambio en caso de error
      setEditingPrices(prices)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Prices</h3>
      
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
            {editingPrices.map(price => {
              const cabin = cabins.find(c => c.id === price.cruise_cabin_id)
              return (
                <tr key={price.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cabin?.name || 'Unknown Cabin'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <input
                      type="number"
                      value={editingId === price.id ? price.price.toString() : price.price.toFixed(2)}
                      onChange={(e) => handlePriceChange(price.id, e.target.value)}
                      disabled={editingId !== price.id}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                        editingId !== price.id ? 'bg-gray-100' : ''
                      }`}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingId === price.id ? (
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`${
                          isSaving 
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleEdit(price.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
} 