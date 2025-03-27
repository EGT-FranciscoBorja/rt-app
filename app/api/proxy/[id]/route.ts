import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
  const apiToken = process.env.NEXT_PUBLIC_API_TOKEN || ''
  const body = await request.json()

  if (!apiUrl || !apiToken) {
    return NextResponse.json({ error: 'API configuration missing' }, { status: 500 })
  }

  try {
    const response = await fetch(`${apiUrl}/api/v1/cruise/${context.params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
  const apiToken = process.env.NEXT_PUBLIC_API_TOKEN || ''

  if (!apiUrl || !apiToken) {
    return NextResponse.json({ error: 'API configuration missing' }, { status: 500 })
  }

  try {
    const response = await fetch(`${apiUrl}/api/v1/cruise/${context.params.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
      },
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 })
  }
} 