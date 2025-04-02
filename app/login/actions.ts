'use server'

import { cookies } from 'next/headers'

export async function login(formData: FormData) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Login Error:', {
        status: response.status,
        statusText: response.statusText,
        data: errorData
      })
      return {
        success: false,
        message: errorData.message || 'Error en el inicio de sesión'
      }
    }

    const data = await response.json()

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