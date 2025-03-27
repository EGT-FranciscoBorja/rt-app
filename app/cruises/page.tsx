'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaCloudUploadAlt, FaFileUpload, FaTimes } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchCruises, selectCruisesStatus } from '../features/cruises/cruisesSlice'
import UploadModal from '@/components/UploadModal'

export default function CruisesPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectCruisesStatus)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCruises())
    }
  }, [status, dispatch])

  const handleFileUpload = async (file: File) => {
    // Implementar lógica de carga de archivo
    console.log('File uploaded:', file)
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Create New Cruise</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="btn btn-primary flex-1 md:flex-none flex items-center justify-center gap-2"
          >
            <FaFileUpload className="text-lg" />
            Upload File
          </button>
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          You can upload an Excel (.xlsx) or CSV (.csv) file with the required format according to the cruises table.
          <a
            href="/assets/demo-cruises.xlsx"
            download
            className="ml-2 text-blue-600 hover:text-blue-800 underline"
          >
            Download example
          </a>
        </p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="card space-y-6">
        {/* Cruise Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cruise Name</label>
          <input
            type="text"
            name="name"
            className="input"
            placeholder="Enter cruise name"
          />
        </div>

        {/* Destination */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
          <input
            type="text"
            name="destination"
            className="input"
            placeholder="Enter destination"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
          <input
            type="text"
            name="duration"
            className="input"
            placeholder="Enter duration (e.g., 7 days)"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price per Person</label>
          <input
            type="number"
            name="price"
            className="input"
            placeholder="Enter price"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
            <input
              type="date"
              name="departureDate"
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Date</label>
            <input
              type="date"
              name="arrivalDate"
              className="input"
            />
          </div>
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Passenger Capacity</label>
          <input
            type="number"
            name="capacity"
            className="input"
            placeholder="Enter passenger capacity"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            rows={4}
            className="input"
            placeholder="Enter cruise description"
          />
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="btn btn-secondary w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <FaCloudUploadAlt />
            Create Cruise
          </button>
        </div>
      </form>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />
    </div>
  )
}
