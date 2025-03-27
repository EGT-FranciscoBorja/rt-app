'use client'

import { FaRegEdit } from "react-icons/fa"
import { RiDeleteBin6Line } from "react-icons/ri"

export interface Cruise {
  id: number
  name: string
  description: string
  website: string
  capacity: number
  base_price: number
  category: number
  created_at: string
  updated_at: string
}

export const handleEdit = async (cruise: Cruise) => {
  try {
    // Asegurarnos de que la categoría sea un número
    const cruiseData = {
      ...cruise,
      category: parseInt(cruise.category.toString())
    }

    console.log('Enviando datos de edición:', cruiseData) // Para debugging

    const response = await fetch(`/api/v1/cruise/${cruise.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: JSON.stringify(cruiseData),
    })

    if (!response.ok) {
      throw new Error('Failed to update cruise')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating cruise:', error)
    throw error
  }
}

export const handleDelete = async (id: number) => {
  try {
    const response = await fetch(`/api/v1/cruise/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete cruise')
    }

    return await response.json()
  } catch (error) {
    console.error('Error deleting cruise:', error)
    throw error
  }
}

interface ActionButtonsProps {
  cruise: Cruise
  onEdit: (cruise: Cruise) => void
  onDelete: (id: number) => void
}

export const ActionButtons = ({ cruise, onEdit, onDelete }: ActionButtonsProps) => {
  return (
    <div className="flex gap-2">
      <button 
        onClick={() => onEdit(cruise)}
        className="text-blue-600 hover:text-blue-900"
      >
        <FaRegEdit className="text-lg" />
      </button>
      <button 
        onClick={() => onDelete(cruise.id)}
        className="text-red-600 hover:text-red-900"
      >
        <RiDeleteBin6Line className="text-lg" />
      </button>
    </div>
  )
} 