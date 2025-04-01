'use server'

import { cookies } from 'next/headers'

export async function login(formData: FormData) {
  try {
    const response = await fetch(`/api/v1/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
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