import React from 'react'
import CabinsList from '@/components/CabinsList'
import ItinerariesList from '@/components/ItinerariesList'

interface PageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CabinsPage({ params, searchParams }: PageProps) {
  const [resolvedParams] = await Promise.all([params, searchParams])
  const cruiseId = parseInt(resolvedParams.id)

  if (isNaN(cruiseId)) {
    return (
      <div className="container py-6">
        <div className="text-center text-red-500">
          Invalid cruise ID
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CabinsList cruiseId={cruiseId} />
      <ItinerariesList cruiseId={cruiseId} />
    </div>
  )
}
