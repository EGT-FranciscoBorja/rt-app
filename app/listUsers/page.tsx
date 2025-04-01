'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaRegEdit } from "react-icons/fa"
import { RiDeleteBin6Line } from "react-icons/ri"
import { FaDownload } from "react-icons/fa6"
import { FaCloudUploadAlt, FaArrowLeft, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchUsers, selectUsersStatus, selectUsers, selectPagination } from '../lib/features/users/usersSlice'
import EditUserModal from './EditUserModal'
import { handleEdit, handleDelete, User } from './actions'

interface UserFilters {
  name: string
  email: string
  role: string
}

export default function ListUsersPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectUsersStatus)
  const Users = useAppSelector(selectUsers)
  const pagination = useAppSelector(selectPagination)
  const [currentPage, setCurrentPage] = useState(1)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isFiltersOpen, setIsFiltersOpen] = useState(true)
  const [filters, setFilters] = useState<UserFilters>({
    name: '',
    email: '',
    role: '',
  })
  const [activeFilters, setActiveFilters] = useState<UserFilters>({
    name: '',
    email: '',
    role: '',
  })

  useEffect(() => {
    dispatch(fetchUsers({
      page: currentPage,
      filters: activeFilters
    }))
  }, [dispatch, currentPage, activeFilters])

  const handleEditClick = (User: User) => {
    setEditingUser(User)
  }

  const handleDeleteClick = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this User?')) {
      try {
        await handleDelete(id)
        dispatch(fetchUsers({
          page: currentPage,
          filters: activeFilters
        }))
      } catch (error) {
        console.error('Error deleting User:', error)
      }
    }
  }

  const handleSaveEdit = async (updatedUser: User) => {
    try {
      await handleEdit(updatedUser)
      dispatch(fetchUsers({
        page: currentPage,
        filters: activeFilters
      }))
      setEditingUser(null)
    } catch (error) {
      console.error('Error updating User:', error)
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleApplyFilters = () => {
    setActiveFilters(filters)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setFilters({
      name: '',
      email: '',
      role: '',
    })
    setActiveFilters({
      name: '',
      email: '',
      role: '',
    })
    setCurrentPage(1)
  }

  const handleRemoveFilter = (filterName: keyof UserFilters) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: ''
    }))
    setActiveFilters(prev => ({
      ...prev,
      [filterName]: ''
    }))
    setCurrentPage(1)
  }

  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5
    const halfMaxPages = Math.floor(maxVisiblePages / 2)

    let startPage = Math.max(1, pagination.current_page - halfMaxPages)
    const endPage = Math.min(pagination.last_page, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    if (pagination.current_page > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => setCurrentPage(pagination.current_page - 1)}
          className="px-3 py-1 text-gray-600 hover:text-gray-900"
        >
          Previous
        </button>
      )
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 rounded ${
            i === pagination.current_page
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {i}
        </button>
      )
    }

    if (pagination.current_page < pagination.last_page) {
      pages.push(
        <button
          key="next"
          onClick={() => setCurrentPage(pagination.current_page + 1)}
          className="px-3 py-1 text-gray-600 hover:text-gray-900"
        >
          Next
        </button>
      )
    }

    return pages
  }

  return (
    <div className="flex gap-6 p-6 max-w-[2000px] mx-auto">
      {/* Filters Section */}
      <div className={`${isFiltersOpen ? 'w-64' : 'w-12'} bg-white p-4 rounded-lg shadow-md transition-all duration-300 relative`}>
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="absolute -right-3 top-4 bg-white rounded-full p-1 shadow-md hover:bg-gray-50"
        >
          {isFiltersOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>

        {isFiltersOpen && (
          <>
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            
            {/* Active Filters Display */}
            {Object.entries(activeFilters).some(([, value]) => value) && (
              <div className="mb-4 p-2 bg-gray-50 rounded">
                <p className="text-sm text-gray-600 mb-2">Active Filters:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(activeFilters).map(([key, value]) => 
                    value && (
                      <span key={key} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {key === 'name' ? 'Name' : 
                         key === 'email' ? 'Email' : 
                         'Role'}: {value}
                        <button
                          onClick={() => handleRemoveFilter(key as keyof UserFilters)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  className="input"
                  placeholder="Search by name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="text"
                  name="email"
                  value={filters.email}
                  onChange={handleFilterChange}
                  className="input"
                  placeholder="Search by email"
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={filters.role}
                  onChange={handleFilterChange}
                  className="input"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="sales">Sales</option>
                  <option value="super-admin">Super admin</option>
                </select>
              </div>

 
              <div className="flex gap-2">
                <button
                  onClick={handleApplyFilters}
                  className="btn btn-primary flex-1"
                >
                  Apply Filters
                </button>
                <button
                  onClick={handleClearFilters}
                  className="btn btn-secondary"
                >
                  Clear
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-800"
            >
              <FaArrowLeft className="text-2xl" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          </div>
          <div className="flex gap-3">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <FaDownload className="text-lg" />
              Download Data
            </button>
            <button 
              onClick={() => router.push('/users')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaCloudUploadAlt className="text-lg" />
              Add New User
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {status === 'loading' ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Loading Users...
                    </td>
                  </tr>
                ) : status === 'failed' ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-red-500">
                      Error loading Users
                    </td>
                  </tr>
                ) : !Array.isArray(Users) || Users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No Users available
                    </td>
                  </tr>
                ) : (
                  Users.map((User) => (
                    <tr key={User.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{User.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 line-clamp-2">{User.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{Array.isArray(User.roles) ? User.roles.join(', ') : User.roles}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick({...User, roles: Array.isArray(User.roles) ? User.roles : [User.roles]})}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FaRegEdit className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(User.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <RiDeleteBin6Line className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {status === 'succeeded' && pagination.last_page > 1 && (
          <div className="mt-4 flex justify-center items-center gap-2">
            {renderPagination()}
          </div>
        )}
      </div>

      {editingUser && (
        <EditUserModal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          user={editingUser}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  )
} 