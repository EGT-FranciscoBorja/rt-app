import { Hotel } from '@/app/lib/types/hotel'

export const handleEdit = (hotel: Hotel) => {
  // TODO: Implementar lógica de edición
  console.log('Editing hotel:', hotel)
}

export const handleDelete = async (hotelId: number) => {
  try {
    const response = await fetch(`/api/v1/hotel/${hotelId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete hotel')
    }

    // Recargar la página para actualizar la lista
    window.location.reload()
  } catch (error) {
    console.error('Error deleting hotel:', error)
    // TODO: Mostrar mensaje de error al usuario
  }
} 