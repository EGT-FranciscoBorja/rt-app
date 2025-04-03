'use client'

import React, { useEffect } from 'react'
import Cards from '@/components/cards'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchAdvice, selectAdvice } from '@/app/lib/features/advices/adviceSlice'

export default function HomePage() {
  const dispatch = useAppDispatch()
  const advice = useAppSelector(selectAdvice)

  useEffect(() => {
    dispatch(fetchAdvice())
  }, [dispatch])

  return (
    <div className="container mx-auto px-4 py-8">

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <p className="text-gray-600 italic">&ldquo;{advice}&rdquo;</p>
      </div>

      <Cards />
    </div>
  )
}
