'use client'

import { useSearchParams } from 'next/navigation'
import ChartersList from '@/components/ChartersList'
import { FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

export default function ChartersPage() {
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