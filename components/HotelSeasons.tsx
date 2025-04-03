'use client'

import React from 'react'

interface Season {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  percentage: number
  created_at: string
  updated_at: string
}

interface HotelSeasonsProps {
  seasons: Season[]
}

export default function HotelSeasons({ seasons }: HotelSeasonsProps) {
  if (!seasons || seasons.length === 0) return null

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Seasons</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {seasons.map((season) => (
          <div key={season.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">{season.name}</h3>
            <div className="mt-2 text-sm text-gray-600">
              <p>From: {new Date(season.start_date).toLocaleDateString()}</p>
              <p>To: {new Date(season.end_date).toLocaleDateString()}</p>
              <p>Percentage: {season.percentage}%</p>
              {season.description && (
                <p className="mt-2 line-clamp-2">{season.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 