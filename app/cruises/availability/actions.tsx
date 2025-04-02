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
  departures: { [key: string]: Departure };
}

export interface Cruise {
  cruise_id: number;
  cruise_name: string;
  itineraries: { [key: string]: Itinerary };
}

export interface ApiResponse {
  success: boolean;
  message: string;
  errors: null | {
    [key: string]: string[];
  };
  data: Cruise[];
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
  minPrice?: string;
  maxPrice?: string;
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