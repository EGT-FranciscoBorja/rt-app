'use server'

import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function login(formData: FormData) {
  try {
    // Primero obtener el token CSRF
    const csrfResponse = await fetch(`${API_URL}/sanctum/csrf-cookie`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include'
    })

    if (!csrfResponse.ok) {
      throw new Error('Error al obtener el token CSRF')
    }

    // Obtener las cookies de la respuesta
    const responseCookies = csrfResponse.headers.get('set-cookie')
    if (!responseCookies) {
      throw new Error('No se recibieron cookies del servidor')
    }

    // Extraer el token XSRF-TOKEN de las cookies
    const xsrfToken = responseCookies.split(';')
      .find(cookie => cookie.trim().startsWith('XSRF-TOKEN='))
      ?.split('=')[1]

    if (!xsrfToken) {
      throw new Error('No se encontró el token XSRF')
    }

    // Realizar la solicitud de login con el token CSRF
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken)
      },
      credentials: 'include',
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Error en el inicio de sesión'
      }
    }

    if (!data.success || !data.data?.token) {
      return {
        success: false,
        message: data.message || 'Error en el inicio de sesión'
      }
    }

    // Guardar el token en una cookie
    const cookieStore = await cookies()
    cookieStore.set('authToken', data.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 días
    })

    // Guardar la información del usuario
    cookieStore.set('user', JSON.stringify(data.data.user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 días
    })

    return {
      success: true,
      message: data.message || 'Inicio de sesión exitoso'
    }
  } catch (error) {
    console.error('Error en login:', error)
    return {
      success: false,
      message: 'Error al conectar con el servidor'
    }
  }
}