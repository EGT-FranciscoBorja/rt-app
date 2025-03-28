import React from 'react'
import CabinsList from '@/components/CabinsList'

interface PageProps {
  params: {
    id: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

async function CabinsPage({ params }: PageProps) {
  const cruiseId = parseInt(params.id)

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

export default CabinsPage
