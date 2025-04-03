'use client'

export interface RoomType {
  id: number;
  hotel_id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  available_quantity: number;
}

export interface Hotel {
  id: number;
  name: string;
  description: string;
  website: string;
  country: string;
  city: string;
  location: string;
  base_price: number;
  category: number;
  created_at: string;
  updated_at: string;
  room_types: RoomType[];
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedData {
  current_page: number;
  data: Hotel[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  errors: null | {
    [key: string]: string[];
  };
  data: PaginatedData;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors: {
    [key: string]: string[];
  };
  data: null;
}

export interface ApiError {
  response: {
    data: ApiErrorResponse;
  };
}

export interface SearchParams {
  check_in: string;
  check_out: string;
  persons: number;
  category?: string;
  price_min?: string;
  price_max?: string;
  page?: string;
  city: string;
}

export const searchAvailability = async (params: SearchParams) => {
  try {
    const response = await fetch('/api/v1/hotel/availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API Error Response:', data);
      throw { 
        response: { 
          data: {
            success: false,
            message: data.message || 'An error occurred while searching for hotels',
            errors: data.errors || {}
          }
        } 
      } as ApiError;
    }

    return data as ApiResponse;
  } catch (error) {
    console.error('Error searching hotel availability:', error);
    if (error instanceof Error) {
      throw { 
        response: { 
          data: {
            success: false,
            message: error.message,
            errors: {}
          }
        } 
      } as ApiError;
    }
    throw error;
  }
}; 