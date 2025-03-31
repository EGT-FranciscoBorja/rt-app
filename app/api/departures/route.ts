import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.rtapi.lat'
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const cruiseId = searchParams.get('cruiseId')
    const itineraryId = searchParams.get('itineraryId')

    if (!cruiseId || !itineraryId) {
      return NextResponse.json(
        { error: 'Se requieren cruiseId e itineraryId' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${API_URL}/api/v1/cruise/${cruiseId}/itinerary/${itineraryId}/departure`,
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
        { error: 'Error al obtener departures' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const formattedData = Array.isArray(data) ? data : [data]
    return NextResponse.json({
      data: formattedData.map(departure => ({
        id: departure.id,
        cruise_itinerary_id: departure.cruise_itinerary_id,
        start_date: departure.start_date,
        end_date: departure.end_date,
        status: departure.status,
        created_at: departure.created_at,
        updated_at: departure.updated_at
      }))
    })
  } catch (error) {
    console.error('Error en proxy de departures:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const cruiseId = searchParams.get('cruiseId')
    const itineraryId = searchParams.get('itineraryId')
    const body = await request.json()

    if (!cruiseId || !itineraryId) {
      return NextResponse.json(
        { error: 'Se requieren cruiseId e itineraryId' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${API_URL}/api/v1/cruise/${cruiseId}/itinerary/${itineraryId}/departure`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify(body)
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Error al crear departure' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error en proxy de departures:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const cruiseId = searchParams.get('cruiseId')
    const itineraryId = searchParams.get('itineraryId')
    const departureId = searchParams.get('departureId')
    const body = await request.json()

    if (!cruiseId || !itineraryId || !departureId) {
      return NextResponse.json(
        { error: 'Se requieren cruiseId, itineraryId y departureId' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${API_URL}/api/v1/cruise/${cruiseId}/itinerary/${itineraryId}/departure/${departureId}`,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify(body)
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Error al actualizar departure' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error en proxy de departures:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const cruiseId = searchParams.get('cruiseId')
    const itineraryId = searchParams.get('itineraryId')
    const departureId = searchParams.get('departureId')

    if (!cruiseId || !itineraryId || !departureId) {
      return NextResponse.json(
        { error: 'Se requieren cruiseId, itineraryId y departureId' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${API_URL}/api/v1/cruise/${cruiseId}/itinerary/${itineraryId}/departure/${departureId}`,
      {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        }
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Error al eliminar departure' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en proxy de departures:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 