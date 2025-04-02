import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = cookies()
    
    // Eliminar las cookies de autenticación
    cookieStore.delete('authToken')
    cookieStore.delete('user')

    return NextResponse.json({ message: 'Logout exitoso' })
  } catch (error) {
    console.error('Error en logout:', error)
    return NextResponse.json(
      { message: 'Error al cerrar sesión' },
      { status: 500 }
    )
  }
} 