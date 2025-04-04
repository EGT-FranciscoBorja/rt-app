import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: { id: string; itineraryId: string; priceId: string } }
) {
  try {
    const { id: cruiseId, itineraryId, priceId } = params
    const body = await request.json()

    console.log('=== Starting PUT request for itinerary price ===')
    console.log('Cruise ID:', cruiseId)
    console.log('Itinerary ID:', itineraryId)
    console.log('Price ID:', priceId)
    console.log('Request body:', body)

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/cruise/${cruiseId}/itinerary/${itineraryId}/price/${priceId}`
    console.log('API URL:', apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    console.log('API Response:', data)

    if (!response.ok) {
      console.error('API Error:', data)
      return NextResponse.json(data, { status: response.status })
    }

    console.log('=== End of PUT request for itinerary price ===')
    return NextResponse.json({ success: true, data: data.data })
  } catch (error) {
    console.error('Error updating price:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error updating price'
      },
      { status: 500 }
    )
  }
} 