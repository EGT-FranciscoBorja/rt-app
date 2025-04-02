import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.rtapi.lat'
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'

    const response = await fetch(
      `${API_URL}/api/v1/hotel?page=${page}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        }
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Error al obtener hoteles' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error en proxy de hoteles:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 