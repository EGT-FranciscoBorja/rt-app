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
  seasons?: Season[]
}

export default function HotelSeasons({ seasons = [] }: HotelSeasonsProps) {
  if (!seasons || seasons.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Seasons</h2>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                This hotel doesn&apos;t have seasons yet. Please contact the manager for more information.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Seasons</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {seasons.map((season) => (
          <div key={season.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{season.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{season.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Start Date:</span>
                <span>{new Date(season.start_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>End Date:</span>
                <span>{new Date(season.end_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Percentage:</span>
                <span>{season.percentage}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 