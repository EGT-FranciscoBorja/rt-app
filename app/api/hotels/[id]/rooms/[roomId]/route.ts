import { NextResponse, NextRequest } from 'next/server'

interface RouteParams {
  params: Promise<{
    id: string
    roomId: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function PUT(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const params = await context.params
    const { id: hotelId, roomId } = params
    console.log('=== Starting PUT request for room ===')
    console.log('Hotel ID received:', hotelId)
    console.log('Room ID received:', roomId)
    console.log('Request URL:', request.url)
    
    const body = await request.json()
    console.log('Request body:', body)
    
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/hotel/${hotelId}/roomType/${roomId}`
    console.log('Real API URL:', apiUrl)

    const headers = {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    console.log('Request headers:', headers)

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
      cache: 'no-store'
    })

    console.log('API response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error:', errorText)
      return NextResponse.json(
        { 
          success: false,
          message: 'Failed to update room',
          status: response.status,
          details: errorText
        }, 
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('API response:', data)
    console.log('=== End of PUT request for room ===')

    return NextResponse.json({ success: true, data: data.data })
  } catch (error) {
    console.error('Error in PUT handler for room:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to update room',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const params = await context.params
    const { id: hotelId, roomId } = params
    console.log('=== Starting DELETE request for room ===')
    console.log('Hotel ID received:', hotelId)
    console.log('Room ID received:', roomId)
    
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/hotel/${hotelId}/roomType/${roomId}`
    console.log('Real API URL:', apiUrl)

    const headers = {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      'Accept': 'application/json',
    }

    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers,
      cache: 'no-store'
    })

    console.log('API response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error:', errorText)
      return NextResponse.json(
        { 
          success: false,
          message: 'Failed to delete room',
          status: response.status,
          details: errorText
        }, 
        { status: response.status }
      )
    }

    console.log('API response successful')
    console.log('=== End of DELETE request for room ===')

    return NextResponse.json({ success: true, data: { id: roomId } })
  } catch (error) {
    console.error('Error in DELETE handler for room:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to delete room',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
} 