import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface Itinerary {
  id: number
  cruise_id: number
  name: string
  days: number
  created_at: string
  updated_at: string
}

interface ItinerariesState {
  items: Itinerary[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: ItinerariesState = {
  items: [],
  status: 'idle',
  error: null
}

export const fetchItineraries = createAsyncThunk(
  'itineraries/fetchItineraries',
  async (cruiseId: number) => {
    const response = await fetch(`/api/v1/cruise/${cruiseId}/itinerary`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
    })
    if (!response.ok) {
      throw new Error('Failed to fetch itineraries')
    }
    const data = await response.json()
    return data.data
  }
)

export const createItinerary = createAsyncThunk(
  'itineraries/createItinerary',
  async ({ cruiseId, itineraryData }: { cruiseId: number, itineraryData: { name: string, days: number } }) => {
    const response = await fetch(`/api/v1/cruise/${cruiseId}/itinerary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: JSON.stringify(itineraryData),
    })
    if (!response.ok) {
      throw new Error('Failed to create itinerary')
    }
    const data = await response.json()
    return data.data
  }
)

export const updateItinerary = createAsyncThunk(
  'itineraries/updateItinerary',
  async ({ cruiseId, itineraryId, itineraryData }: { cruiseId: number, itineraryId: number, itineraryData: { name: string, days: number } }) => {
    const response = await fetch(`/api/v1/cruise/${cruiseId}/itinerary/${itineraryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: JSON.stringify(itineraryData),
    })
    if (!response.ok) {
      throw new Error('Failed to update itinerary')
    }
    const data = await response.json()
    return data.data
  }
)

export const deleteItinerary = createAsyncThunk(
  'itineraries/deleteItinerary',
  async ({ cruiseId, itineraryId }: { cruiseId: number, itineraryId: number }) => {
    const response = await fetch(`/api/v1/cruise/${cruiseId}/itinerary/${itineraryId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
    })
    if (!response.ok) {
      throw new Error('Failed to delete itinerary')
    }
    return itineraryId
  }
)

const itinerariesSlice = createSlice({
  name: 'itineraries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItineraries.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchItineraries.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchItineraries.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch itineraries'
      })
      .addCase(createItinerary.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateItinerary.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteItinerary.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload)
      })
  },
})

export const selectItineraries = (state: { itineraries: ItinerariesState }) => state.itineraries.items
export const selectItinerariesStatus = (state: { itineraries: ItinerariesState }) => state.itineraries.status
export const selectItinerariesError = (state: { itineraries: ItinerariesState }) => state.itineraries.error

export default itinerariesSlice.reducer
