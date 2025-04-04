import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function PUT(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const params = await context.params
    const { id: hotelId } = params
    const body = await request.json()

    console.log('=== Starting PUT request for hotel ===')
    console.log('Hotel ID:', hotelId)
    console.log('Request body:', body)

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/hotel/${hotelId}`
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

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error:', errorText)
      return NextResponse.json(
        { 
          success: false,
          message: 'Failed to update hotel',
          status: response.status,
          details: errorText
        }, 
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('API response:', data)
    console.log('=== End of PUT request for hotel ===')

    return NextResponse.json({ success: true, data: data.data })
  } catch (error) {
    console.error('Error updating hotel:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : 'Error updating hotel'
      },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const params = await context.params
    const { id: hotelId } = params

    console.log('=== Starting GET request for hotel ===')
    console.log('Hotel ID:', hotelId)

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/hotel/${hotelId}`
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
          message: 'Failed to fetch hotel',
          status: response.status,
          details: errorText
        }, 
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('API response:', data)
    console.log('=== End of GET request for hotel ===')

    return NextResponse.json({ success: true, data: data.data })
  } catch (error) {
    console.error('Error fetching hotel:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : 'Error fetching hotel'
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
    const { id: hotelId } = params

    console.log('=== Starting DELETE request for hotel ===')
    console.log('Hotel ID:', hotelId)

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/hotel/${hotelId}`
    console.log('API URL:', apiUrl)

    const response = await fetch(apiUrl, {
      method: 'DELETE',
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
          message: 'Failed to delete hotel',
          status: response.status,
          details: errorText
        }, 
        { status: response.status }
      )
    }

    console.log('Hotel deleted successfully')
    console.log('=== End of DELETE request for hotel ===')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting hotel:', error)
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : 'Error deleting hotel'
      },
      { status: 500 }
    )
  }
} 