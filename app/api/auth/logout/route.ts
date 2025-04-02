import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json({ success: true, message: 'Logout successful' })
    
    // Eliminar las cookies de autenticación
    response.cookies.delete('authToken')
    response.cookies.delete('user')

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, message: 'Error during logout' },
      { status: 500 }
    )
  }
} 