import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get('user')
    const tokenCookie = cookieStore.get('authToken')

    if (!userCookie || !tokenCookie) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    try {
      const user = JSON.parse(userCookie.value)
      return NextResponse.json({
        success: true,
        user,
        token: tokenCookie.value
      })
    } catch (error) {
      console.error('Error processing user data:', error)
      return NextResponse.json(
        { success: false, message: 'Error processing user data' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error checking authentication:', error)
    return NextResponse.json(
      { success: false, message: 'Error checking authentication' },
      { status: 500 }
    )
  }
} 