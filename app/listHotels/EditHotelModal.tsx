import React, { useState, useEffect } from 'react'
import { Hotel } from '@/app/lib/features/hotels/hotelSlice'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchSeasons } from '@/app/lib/features/seasons/seasonSlice'

interface Season {
  id: number
  name: string
  start_date: string
  end_date: string
  percentage: number
}

interface EditHotelModalProps {
  hotel: Hotel & { seasons?: number[] }
  onClose: () => void
  onSave: (hotel: Hotel & { seasons?: number[] }) => void
}

const EditHotelModal: React.FC<EditHotelModalProps> = ({ hotel, onClose, onSave }) => {
  const dispatch = useAppDispatch()
  const seasons = useAppSelector((state) => state.seasons.items) as Season[]
  const seasonsStatus = useAppSelector((state) => state.seasons.status)
  const [editedHotel, setEditedHotel] = useState<Hotel & { seasons?: number[] }>(hotel)

  useEffect(() => {
    if (seasonsStatus === 'idle') {
      dispatch(fetchSeasons(1))
    }
  }, [dispatch, seasonsStatus])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log('Iniciando actualización del hotel:', editedHotel)
      const response = await fetch(`/api/v1/hotel/${editedHotel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
        body: JSON.stringify({
          ...editedHotel,
          seasons: editedHotel.seasons?.map((season: number | { id: number }) => 
            typeof season === 'object' ? season.id : season
          ) || []
        }),
      })

      console.log('Respuesta recibida:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error al actualizar hotel:', errorData)
        throw new Error(errorData.error || 'Failed to update hotel')
      }

      const data = await response.json()
      console.log('Hotel actualizado exitosamente:', data)
      
      onSave(editedHotel)
      onClose()
    } catch (error) {
      console.error('Error updating hotel:', error)
      alert('Error al actualizar el hotel: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    }
  }

  const handleSeasonChange = (seasonId: number) => {
    setEditedHotel(prev => ({
      ...prev,
      seasons: prev.seasons?.includes(seasonId)
        ? prev.seasons.filter(id => id !== seasonId)
        : [...(prev.seasons || []), seasonId]
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Editar Hotel</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={editedHotel.name}
                onChange={(e) => setEditedHotel({ ...editedHotel, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Website</label>
              <input
                type="url"
                value={editedHotel.website}
                onChange={(e) => setEditedHotel({ ...editedHotel, website: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                value={editedHotel.country}
                onChange={(e) => setEditedHotel({ ...editedHotel, country: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                value={editedHotel.city}
                onChange={(e) => setEditedHotel({ ...editedHotel, city: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={editedHotel.location}
                onChange={(e) => setEditedHotel({ ...editedHotel, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Base Price</label>
              <input
                type="number"
                value={editedHotel.base_price}
                onChange={(e) => setEditedHotel({ ...editedHotel, base_price: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="number"
                value={editedHotel.category}
                onChange={(e) => setEditedHotel({ ...editedHotel, category: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={editedHotel.description}
              onChange={(e) => setEditedHotel({ ...editedHotel, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={4}
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Temporadas</label>
            
            {/* Temporadas seleccionadas */}
            {editedHotel.seasons && editedHotel.seasons.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Temporadas seleccionadas:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {seasons
                    .filter(season => editedHotel.seasons?.includes(season.id))
                    .map(season => (
                      <div 
                        key={season.id} 
                        className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-medium text-blue-900">{season.name}</div>
                          <div className="text-xs text-blue-700">
                            {new Date(season.start_date).toLocaleDateString()} - {new Date(season.end_date).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-blue-700">Porcentaje: {season.percentage}%</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSeasonChange(season.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Lista de temporadas disponibles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {seasonsStatus === 'loading' ? (
                <div className="text-gray-500">Cargando temporadas...</div>
              ) : seasonsStatus === 'failed' ? (
                <div className="text-red-500">Error al cargar temporadas</div>
              ) : (
                seasons.map((season) => {
                  const isSelected = editedHotel.seasons?.includes(season.id)
                  return (
                    <div 
                      key={season.id} 
                      className={`flex items-center p-4 border rounded-lg ${
                        isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        id={`season-${season.id}`}
                        checked={isSelected}
                        onChange={() => handleSeasonChange(season.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`season-${season.id}`} className="ml-3 flex-1">
                        <div className="text-sm font-medium text-gray-900">{season.name}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(season.start_date).toLocaleDateString()} - {new Date(season.end_date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">Porcentaje: {season.percentage}%</div>
                      </label>
                    </div>
                  )
                })
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
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