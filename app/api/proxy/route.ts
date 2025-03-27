import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
  const apiToken = process.env.NEXT_PUBLIC_API_TOKEN || ''

  if (!apiUrl || !apiToken) {
    return NextResponse.json({ error: 'API configuration missing' }, { status: 500 })
  }

  try {
    const response = await fetch(`${apiUrl}/api/v1/cruise?${searchParams.toString()}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
      },
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
} 