'use client'

import { useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { User } from './actions'

interface EditUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onSave: (user: User) => Promise<void>
}

interface FormData {
  name: string;
  email: string;
  roles: string[];
  password?: string;
}

interface FormErrors {
  name?: string[];
  email?: string[];
  password?: string[];
  roles?: string[];
  general?: string[];
}

export default function EditUserModal({ isOpen, onClose, user, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    roles: [],
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        roles: user.roles,
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || isSubmitting) return

    setIsSubmitting(true)
    setErrors({}) // Clear previous errors

    try {
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        roles: formData.roles,
        ...(formData.password && { password: formData.password }),
      }
      await onSave(updatedUser)
      setErrors({}) // Clear errors on success
      onClose()
    } catch (error: any) {
      console.error('Error saving user:', error)
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        setErrors({
          general: ['An unexpected error occurred. Please try again.']
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (Object.keys(errors).length > 0) {
      if (!window.confirm('There are validation errors. Are you sure you want to close?')) {
        return
      }
    }
    setErrors({})
    onClose()
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Edit User</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {errors.general[0]}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`input ${errors.name ? 'border-red-500' : ''}`}
              required
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`input ${errors.email ? 'border-red-500' : ''}`}
              required
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={formData.password || ''}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`input ${errors.password ? 'border-red-500' : ''}`}
              minLength={8}
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Leave blank to keep the current password. If you enter a new password, it must be at least 8 characters long.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.roles || []}
              onChange={(e) => setFormData({ ...formData, roles: Array.from(e.target.selectedOptions, option => option.value) })}
              className={`input ${errors.roles ? 'border-red-500' : ''}`}
              required
              disabled={isSubmitting}
              multiple
            >
              <option value="admin">Admin</option>
              <option value="sales">Sales</option>
              <option value="super-admin">SuperAdmin</option>
            </select>
            {errors.roles && (
              <p className="mt-1 text-sm text-red-600">{errors.roles[0]}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 