'use client'

import { useSearchParams } from 'next/navigation'
import ChartersList from '@/components/ChartersList'
import { FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { Suspense } from 'react'

function ChartersContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const cruiseId = Number(searchParams.get('cruiseId'))
  const itineraryId = Number(searchParams.get('itineraryId'))

  if (!cruiseId || !itineraryId) {
    return <div>Error: Invalid parameters</div>
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
      </div>
      <ChartersList cruiseId={cruiseId} itineraryId={itineraryId} />
    </div>
  )
}

function Loading() {
  return (
    <div className="p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-24 mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  )
}

export default function ChartersPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ChartersContent />
    </Suspense>
  )
}