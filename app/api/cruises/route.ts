import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const name = searchParams.get('name') || ''
    const category = searchParams.get('category') || ''
    const priceMin = searchParams.get('priceMin') || ''
    const priceMax = searchParams.get('priceMax') || ''
    const capacityMin = searchParams.get('capacityMin') || ''
    const capacityMax = searchParams.get('capacityMax') || ''

    const queryParams = new URLSearchParams({
      page,
      ...(name && { name }),
      ...(category && { category }),
      ...(priceMin && { price_min: priceMin }),
      ...(priceMax && { price_max: priceMax }),
      ...(capacityMin && { capacity_min: capacityMin }),
      ...(capacityMax && { capacity_max: capacityMax })
    })

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/cruise?${queryParams.toString()}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Cruise API Error:', {
        status: response.status,
        statusText: response.statusText,
        data: errorData
      })
      return NextResponse.json(
        { success: false, message: errorData.message || 'Error al obtener los cruceros' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error en proxy de cruceros:', error)
    return NextResponse.json(
      { success: false, message: 'Error al conectar con el servidor' },
      { status: 500 }
    )
  }
} 