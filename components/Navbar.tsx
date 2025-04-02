'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout, checkAuth } from '@/app/lib/features/auth/authSlice'
import { FiSun, FiMoon, FiLogOut } from 'react-icons/fi'
import { RootState } from '@/app/lib/store'
import Logo from '@/public/rtlogo.svg'

export default function Navbar() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state: RootState) => state.auth.user)
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if dark mode is active on load
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)

    // Check authentication on load
    dispatch(checkAuth())
  }, [dispatch])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  const handleLogout = async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      // Clear Redux state
      dispatch(logout())
      
      // Redirect to login
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
      // Still try to redirect to login
      window.location.href = '/login'
    }
  }

  // Function to format role
  const formatRole = (roles: string[] | undefined) => {
    if (!roles) return 'Role not defined'
    if (!Array.isArray(roles)) return 'Role not defined'
    if (roles.length === 0) return 'Role not defined'
    
    // Take the first role from the array
    const role = roles[0]
    // If the role is already in readable format, return it as is
    if (role.includes(' ')) return role
    // Convert role to readable format (e.g., "super-admin" -> "Super Admin")
    return role
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  if (!mounted) {
    return (
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <Image src={Logo} alt="Logo" width={40} height={40} />
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {user && (
              <>
                <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name || user.email}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatRole(user.roles)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <FiLogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </>
            )}

            <button
              onClick={toggleTheme}
              className="relative w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-6 h-6">
                  <FiSun className={`absolute inset-0 h-5 w-5 text-gray-600 dark:text-gray-400 transition-all duration-300 ${isDark ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`} />
                  <FiMoon className={`absolute inset-0 h-5 w-5 text-gray-600 dark:text-gray-400 transition-all duration-300 ${isDark ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 