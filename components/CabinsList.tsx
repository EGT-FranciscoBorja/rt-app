'use client'

import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchCabins, selectCabins, selectCabinsStatus } from '@/app/lib/features/cabins/cabinsSlice'
import { FaArrowLeft } from "react-icons/fa"
import { useRouter } from 'next/navigation'
import { usePermissions } from '@/app/hooks/usePermissions'

interface Cabin {
  id: number
  name: string
  description: string
  cruise_id: number
  price: number
  capacity: number
  created_at: string
  updated_at: string
}

interface CabinsListProps {
  cruiseId: number
}

function CabinsList({ cruiseId }: CabinsListProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { canEdit } = usePermissions()
  const cabins = useAppSelector(selectCabins) as Cabin[]
  const status = useAppSelector(selectCabinsStatus)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCabins(cruiseId))
    }
  }, [dispatch, status, cruiseId])

  return (
    <div className="container py-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft className="text-2xl" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Cruise Cabins</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {status === 'loading' ? (
                <tr>
                  <td colSpan={canEdit ? 6 : 5} className="px-6 py-4 text-center text-gray-500">
                    Loading cabins...
                  </td>
                </tr>
              ) : status === 'failed' ? (
                <tr>
                  <td colSpan={canEdit ? 6 : 5} className="px-6 py-4 text-center text-red-500">
                    Error loading cabins
                  </td>
                </tr>
              ) : !Array.isArray(cabins) || cabins.length === 0 ? (
                <tr>
                  <td colSpan={canEdit ? 6 : 5} className="px-6 py-4 text-center text-gray-500">
                    No cabins available
                  </td>
                </tr>
              ) : (
                cabins.map((cabin) => {
                  if (!cabin || typeof cabin !== 'object') return null
                  
                  const basePrice = typeof cabin.price === 'number' ? cabin.price : 0
                  const quantity = typeof cabin.capacity === 'number' ? cabin.capacity : 0
                  
                  return (
                    <tr key={cabin.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{cabin.name || 'Sin nombre'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${basePrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cabin.created_at ? new Date(cabin.created_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cabin.updated_at ? new Date(cabin.updated_at).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CabinsList
