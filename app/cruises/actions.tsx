'use client'

import { Cruise } from '../listCruises/actions'

export const handleCreateCruise = async (cruiseData: Omit<Cruise, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const response = await fetch('/api/v1/cruise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: JSON.stringify(cruiseData),
    })

    if (!response.ok) {
      throw new Error('Failed to create cruise')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating cruise:', error)
    throw error
  }
}

export const handleFileUpload = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/v1/cruise/upload', {
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