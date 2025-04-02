import { Metadata } from 'next'
import HotelRoomsClient from './HotelRoomsClient'

export const metadata: Metadata = {
  title: 'Hotel Rooms',
  description: 'Manage hotel rooms'
}

export default function HotelRoomsPage({ params }: { params: { id: string } }) {
  return <HotelRoomsClient hotelId={params.id} />
}
