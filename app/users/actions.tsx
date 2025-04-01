'use client'

import { User } from '../listUsers/actions'

export const handleCreateUser = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const response = await fetch('/api/v1/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      throw new Error('Failed to create user')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

export const handleFileUpload = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/v1/user/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload file')
    }

    return await response.json()
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
} 