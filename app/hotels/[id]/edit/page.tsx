import { Metadata } from 'next'
import EditHotelPageContent from './EditHotelPageContent'

export const metadata: Metadata = {
  title: 'Edit Hotel',
  description: 'Edit hotel details'
}

interface PageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function EditHotelPage({ params }: PageProps) {
  const resolvedParams = await params
  return <EditHotelPageContent hotelId={resolvedParams.id} />
} 