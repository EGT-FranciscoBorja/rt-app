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
    console.log('=== Inicio de la petición PUT ===')
    console.log('Hotel ID recibido:', hotelId)
    console.log('URL de la petición:', request.url)
    
    const body = await request.json()
    console.log('Cuerpo de la petición:', body)
    
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/hotel/${hotelId}`
    console.log('URL de la API real:', apiUrl)
    console.log('Token de la API:', process.env.NEXT_PUBLIC_API_TOKEN)

    const formattedBody = {
      name: body.name,
      description: body.description,
      website: body.website,
      country: body.country,
      city: body.city,
      location: body.location,
      base_price: body.base_price,
      category: body.category,
      seasons: body.seasons || [],
      cancelPolicies: body.cancelPolicies || []
    }

    console.log('Cuerpo formateado para la API:', formattedBody)

    const headers = {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    console.log('Headers de la petición:', headers)

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify(formattedBody),
      cache: 'no-store'
    })

    console.log('Estado de la respuesta de la API:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error de la API:', errorText)
      return NextResponse.json(
        { 
          error: 'Failed to update hotel',
          status: response.status,
          message: errorText
        }, 
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Respuesta exitosa de la API:', data)
    console.log('=== Fin de la petición PUT ===')

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error en el manejador PUT:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update hotel',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
} 