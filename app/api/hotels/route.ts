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

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/hotel?page=${page}`, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        'Accept': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error:', errorText)
      return NextResponse.json(
        { success: false, message: 'Error loading hotels' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Ensure each hotel has seasons and cancel_policies properties
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

    return NextResponse.json({
      success: true,
      message: 'Success',
      errors: null,
      data: formattedData.data
    })
  } catch (error) {
    console.error('Error fetching hotels:', error)
    return NextResponse.json(
      { success: false, message: 'Error loading hotels' },
      { status: 500 }
    )
  }
} 