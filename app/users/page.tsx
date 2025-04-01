'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaCloudUploadAlt, FaFileUpload, FaTimes } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchUsers, selectUsersStatus } from '../lib/features/users/usersSlice'
import UploadModal from '@/components/UploadModal'
import { handleCreateUser, handleFileUpload } from './actions'

export default function UsersPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectUsersStatus)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    roles: string[];
  }>({
    name: '',
    email: '',
    password: '',
    roles: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers({
        page: 1,
        filters: {
          name: '',
          email: '',
          role: '',
        }
      }))
    }
  }, [status, dispatch])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name === 'roles') {
      const select = e.target as HTMLSelectElement
      const selectedRoles = Array.from(select.selectedOptions).map(option => option.value)
      setFormData(prev => ({
        ...prev,
        roles: selectedRoles
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validaciones
      if (!formData.name.trim()) {
        throw new Error('El nombre es requerido')
      }

      if (!formData.email.trim()) {
        throw new Error('El email es requerido')
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error('Por favor ingrese un email válido')
      }

      if (formData.password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres')
      }

      if (formData.roles.length === 0) {
        throw new Error('Debe seleccionar al menos un rol')
      }

      const userData = {
        name: formData.name,
        email: formData.email,
        roles: formData.roles,
        password: formData.password,
      }

      console.log('Sending data:', userData) // For debugging

      await handleCreateUser(userData)

      dispatch(fetchUsers({
        page: 1,
        filters: {
          name: '',
          email: '',
          role: '',
        }
      }))
      router.push('/listUsers')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating user. Please try again.')
      console.error('Error creating user:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUploadSubmit = async (file: File) => {
    try {
      await handleFileUpload(file)
      dispatch(fetchUsers({
        page: 1,
        filters: {
          name: '',
          email: '',
          role: '',
        }
      }))
      setIsUploadModalOpen(false)
    } catch (err) {
      console.error('Error uploading file:', err)
    }
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Create New User</h1>
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
          You can upload an Excel (.xlsx) or CSV (.csv) file with the required format according to the users table.
          <a
            href="/assets/demo-users.xlsx"
            download
            className="ml-2 text-blue-600 hover:text-blue-800 underline"
          >
            Download example
          </a>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="input"
            placeholder="Enter user name"
            required
            minLength={1}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="input"
            placeholder="Enter user email"
            required
            pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="input"
            placeholder="Enter user password"
            required
            minLength={8}
          />
          <p className="text-sm text-gray-500 mt-1">La contraseña debe tener al menos 8 caracteres</p>
        </div>

        {/* Roles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Roles <span className="text-red-500">*</span>
          </label>
          <select
            name="roles"
            value={formData.roles}
            onChange={handleInputChange}
            className="input"
            required
            multiple
          >
            <option value="admin">Admin</option>
            <option value="sales">Sales</option>
            <option value="super-admin">SuperAdmin</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">Mantén presionada la tecla Ctrl para seleccionar múltiples roles</p>
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
            disabled={isSubmitting}
            className="btn btn-primary w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FaCloudUploadAlt />
            {isSubmitting ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUploadSubmit}
      />
    </div>
  )
}
