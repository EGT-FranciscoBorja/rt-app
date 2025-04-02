import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('Attempting login with:', { email })

    const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await apiResponse.json()
    console.log('API Response:', data)

    if (!apiResponse.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Login error' },
        { status: apiResponse.status }
      )
    }

    if (!data.success || !data.data?.token) {
      return NextResponse.json(
        { success: false, message: data.message || 'Login error' },
        { status: 400 }
      )
    }

    // Ensure roles is an array
    const roles = Array.isArray(data.data.user.roles) 
      ? data.data.user.roles 
      : typeof data.data.user.roles === 'string' 
        ? data.data.user.roles.split(',').map((role: string) => role.trim())
        : []

    // Create response with cookies
    const nextResponse = NextResponse.json({
      success: true,
      data: {
        user: {
          ...data.data.user,
          roles: roles
        },
        token: data.data.token
      }
    })

    // Add cookies to response
    nextResponse.cookies.set('authToken', data.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    nextResponse.cookies.set('user', JSON.stringify({
      ...data.data.user,
      roles: roles
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return nextResponse
  } catch (error) {
    console.error('Authentication route error:', error)
    return NextResponse.json(
      { success: false, message: 'Server connection error' },
      { status: 500 }
    )
  }
} 