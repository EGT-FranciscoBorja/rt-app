'use client'

import React from 'react'
import { useAppDispatch } from '@/app/hooks'
import { fetchHotels } from '@/app/lib/features/hotels/hotelSlice'

export default function ListHotelsPage() {
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    dispatch(fetchHotels(1))
  }, [dispatch])

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Hotels</h1>
      {/* Resto del contenido */}
    </div>
  )
}
