import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const hotelId = searchParams.get('hotelId')
    const name = searchParams.get('name')
    const priceMin = searchParams.get('price_min')
    const priceMax = searchParams.get('price_max')
    const capacity = searchParams.get('capacity')

    if (!hotelId) {
      return NextResponse.json(
        { success: false, message: 'Se requiere el ID del hotel' },
        { status: 400 }
      )
    }

    const queryParams = new URLSearchParams()
    if (name) queryParams.append('name', name)
    if (priceMin) queryParams.append('price_min', priceMin)
    if (priceMax) queryParams.append('price_max', priceMax)
    if (capacity) queryParams.append('capacity', capacity)

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/hotel/${hotelId}/roomType?${queryParams.toString()}`
    console.log('Fetching from:', url)

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { success: false, message: errorData.message || 'Error al obtener las habitaciones' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({ success: true, data: data.data })
  } catch (error) {
    console.error('Error in GET /api/rooms:', error)
    return NextResponse.json(
      { success: false, message: 'Error al obtener las habitaciones' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const hotelId = searchParams.get('hotelId')
    const body = await request.json()

    if (!hotelId) {
      return NextResponse.json(
        { success: false, message: 'Se requiere el ID del hotel' },
        { status: 400 }
      )
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/hotel/${hotelId}/roomType`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { success: false, message: errorData.message || 'Error al crear la habitación' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({ success: true, data: data.data })
  } catch (error) {
    console.error('Error in POST /api/rooms:', error)
    return NextResponse.json(
      { success: false, message: 'Error al crear la habitación' },
      { status: 500 }
    )
  }
}
