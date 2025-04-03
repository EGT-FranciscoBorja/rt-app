'use client'

export interface Cabin {
  cabin_id: number;
  cabin_name: string;
  available_quantity: number;
  price: number;
}

export interface Departure {
  departure_id: number;
  start_date: string;
  end_date: string;
  cabins: Cabin[];
}

export interface Itinerary {
  itinerary_id: number;
  itinerary_name: string;
  departures: Departure[];
}

export interface Cruise {
  cruise_id: number;
  cruise_name: string;
  category: number;
  itineraries: Itinerary[];
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedData {
  current_page: number;
  data: Cruise[];
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
}

export const searchAvailability = async (params: SearchParams) => {
  try {
    const response = await fetch('/api/v1/cruise/availability', {
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
      throw { response: { data } } as ApiError;
    }

    return data as ApiResponse;
  } catch (error) {
    console.error('Error searching cruise availability:', error);
    throw error;
  }
}; 