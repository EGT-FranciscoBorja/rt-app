import { NextRequest, NextResponse } from 'next/server'

interface Hotel {
  id: number
  name: string
  description: string
  website: string
  country: string
  city: string
  location: string
  base_price: number
  category: number
  created_at: string
  updated_at: string
  seasons?: Array<{
    id: number
    name: string
    description: string
    start_date: string
    end_date: string
    percentage: number
    created_at: string
    updated_at: string
  }>
  cancel_policies?: Array<{
    id: number
    name: string
    description: string
    days: number
    percentage: number
    created_at: string
    updated_at: string
  }>
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'

    console.log('=== Starting GET request for hotels list ===')
    console.log('Page:', page)

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/hotel?page=${page}`
    console.log('API URL:', apiUrl)

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error:', errorText)
      return NextResponse.json(
        { 
          success: false,
          message: 'Failed to fetch hotels',
          status: response.status,
          details: errorText
        }, 
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Asegurarse de que cada hotel tenga las propiedades seasons y cancel_policies
    const formattedData = {
      ...data,
      data: data.data.map((hotel: Hotel) => ({
        ...hotel,
        seasons: hotel.seasons || [],
        cancel_policies: hotel.cancel_policies || []
      }))
    }

    console.log('API response processed')
    console.log('=== End of GET request for hotels list ===')

    return NextResponse.json({ success: true, data: formattedData })
  } catch (error) {
    console.error('Error fetching hotels:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : 'Error fetching hotels'
      },
      { status: 500 }
    )
  }
} 