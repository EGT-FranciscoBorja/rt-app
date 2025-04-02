import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = cookies()
    const userCookie = cookieStore.get('user')
    const tokenCookie = cookieStore.get('authToken')

    if (!userCookie || !tokenCookie) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    let user
    try {
      user = JSON.parse(userCookie.value)
    } catch (error) {
      console.error('Error parsing user cookie:', error)
      return NextResponse.json(
        { success: false, message: 'Error processing user data' },
        { status: 401 }
      )
    }

    // Ensure roles is an array
    const roles = Array.isArray(user.roles) 
      ? user.roles 
      : typeof user.roles === 'string' 
        ? user.roles.split(',').map((role: string) => role.trim())
        : []

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        roles: roles
      },
      token: tokenCookie.value
    })
  } catch (error) {
    console.error('Authentication check error:', error)
    return NextResponse.json(
      { success: false, message: 'Error checking authentication' },
      { status: 500 }
    )
  }
} 