import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'

  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/season?page=${page}`
    console.log('Fetching seasons from:', apiUrl)

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store'
    })

    console.log('API Response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error response:', errorText)
      return NextResponse.json(
        { 
          error: 'Failed to fetch seasons',
          status: response.status,
          message: errorText
        }, 
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('API Response data:', data)

    // Asegurarnos de que la respuesta tenga la estructura esperada
    const formattedData = {
      data: data.data.data || [],
      current_page: data.data.current_page || 1,
      last_page: data.data.last_page || 1,
      total: data.data.total || 0
    }

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('Error fetching seasons:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch seasons',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
} 