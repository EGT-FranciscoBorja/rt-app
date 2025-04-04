export interface Hotel {
  id: number
  name: string
  description: string
  website: string
  country: string
  city: string
  location: string
  base_price: number
  category: number
  created_at: string
  updated_at: string
  seasons?: Array<{
    id: number
    name: string
    description: string
    start_date: string
    end_date: string
    percentage: number
    created_at: string
    updated_at: string
  }>
  cancel_policies?: Array<{
    id: number
    name: string
    description: string
    days: number
    percentage: number
    created_at: string
    updated_at: string
  }>
} 