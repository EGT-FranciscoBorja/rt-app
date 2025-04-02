'use client'

import { FaRegEdit } from "react-icons/fa"
import { RiDeleteBin6Line } from "react-icons/ri"

export interface User {
  id: number
  name: string
  email: string
  roles: string[]
  created_at: string
  updated_at: string
}

export const handleEdit = async (user: User) => {
  try {
    // Asegurarnos de que la categoría sea un número
    const userData = {
      ...user,
    }

    console.log('Enviando datos de edición:', userData) // Para debugging

    const response = await fetch(`/api/v1/user/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw { response: { data } }
    }

    return data
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

export const handleDelete = async (id: number) => {
  try {
    const response = await fetch(`/api/v1/user/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete user')
    }

    return await response.json()
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}

interface ActionButtonsProps {
  user: User
  onEdit: (user: User) => void
  onDelete: (id: number) => void
}

export const ActionButtons = ({ user, onEdit, onDelete }: ActionButtonsProps) => {
  return (
    <div className="flex gap-2">
      <button 
        onClick={() => onEdit(user)}
        className="text-blue-600 hover:text-blue-900"
      >
        <FaRegEdit className="text-lg" />
      </button>
      <button 
        onClick={() => onDelete(user.id)}
        className="text-red-600 hover:text-red-900"
      >
        <RiDeleteBin6Line className="text-lg" />
      </button>
    </div>
  )
} 