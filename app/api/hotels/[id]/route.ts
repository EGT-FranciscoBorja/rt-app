import { NextResponse } from 'next/server'

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id: hotelId } = await context.params
    const body = await request.json()
    console.log('Received body:', body) // Para debugging

    const formattedBody = {
      name: body.name,
      description: body.description,
      website: body.website,
      country: body.country,
      city: body.city,
      location: body.location,
      base_price: Number(body.base_price),
      category: Number(body.category),
      seasons: Array.isArray(body.seasons) ? body.seasons : [],
      cancel_policies: Array.isArray(body.cancel_policies) ? body.cancel_policies : []
    }

    console.log('Formatted body:', formattedBody) // Para debugging

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/hotel/${hotelId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: JSON.stringify(formattedBody),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('API Error:', error) // Para debugging
      return NextResponse.json({ error: error.message }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating hotel:', error)
    return NextResponse.json(
      { error: 'Error updating hotel' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id: hotelId } = await context.params
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/hotel/${hotelId}`

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.message || 'Error al obtener el hotel' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error en GET /api/v1/hotel/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 