'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from './actions'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)

    try {
      console.log('Iniciando proceso de login...')
      const result = await login(formData)
      console.log('Resultado del login:', result)
      
      if (result.success) {
        console.log('Login exitoso, redirigiendo...')
        // Redirigir al inicio
        router.push('/')
        // Forzar una recarga después de la redirección
        router.refresh()
      } else {
        console.error('Error en login:', result.message)
        setError(result.message || 'Error en el inicio de sesión')
      }
    } catch (error) {
      console.error('Error al procesar el inicio de sesión:', error)
      setError('Error al procesar el inicio de sesión. Por favor, intente nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-semibold text-gray-800">
          Iniciar Sesión
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="tu@email.com"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Tu contraseña"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}
