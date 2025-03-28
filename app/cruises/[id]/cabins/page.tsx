import React from 'react'
import CabinsList from '@/components/CabinsList'

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
    <div>
      <CabinsList cruiseId={cruiseId} />
    </div>
  )
}
