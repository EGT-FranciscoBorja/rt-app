import { Metadata } from 'next'
import HotelRoomsClient from './HotelRoomsClient'

export const metadata: Metadata = {
  title: 'Hotel Rooms',
  description: 'Manage hotel rooms'
}

interface PageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function HotelRoomsPage({ params }: PageProps) {
  const resolvedParams = await params
  return <HotelRoomsClient hotelId={resolvedParams.id} />
}
