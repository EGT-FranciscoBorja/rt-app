import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface Departure {
  id: number
  cruise_itinerary_id: number
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
}

interface DeparturesState {
  items: Departure[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: DeparturesState = {
  items: [],
  status: 'idle',
  error: null
}

export const fetchDepartures = createAsyncThunk(
  'departures/fetchDepartures',
  async ({ cruiseId, itineraryId }: { cruiseId: number, itineraryId: number }) => {
    const response = await fetch(`/api/v1/cruise/${cruiseId}/itinerary/${itineraryId}/departure`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
    })
    if (!response.ok) {
      throw new Error('Failed to fetch departures')
    }
    const data = await response.json()
    return data.data
  }
)

export const createDeparture = createAsyncThunk(
  'departures/createDeparture',
  async ({ cruiseId, itineraryId, departureData }: { cruiseId: number, itineraryId: number, departureData: { start_date: string, end_date: string } }) => {
    const response = await fetch(`/api/v1/cruise/${cruiseId}/itinerary/${itineraryId}/departure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: JSON.stringify(departureData),
    })
    if (!response.ok) {
      throw new Error('Failed to create departure')
    }
    const data = await response.json()
    return data.data
  }
)

export const updateDeparture = createAsyncThunk(
  'departures/updateDeparture',
  async ({ cruiseId, itineraryId, departureId, departureData }: { cruiseId: number, itineraryId: number, departureId: number, departureData: { start_date: string, end_date: string } }) => {
    const response = await fetch(`/api/v1/cruise/${cruiseId}/itinerary/${itineraryId}/departure/${departureId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: JSON.stringify(departureData),
    })
    if (!response.ok) {
      throw new Error('Failed to update departure')
    }
    const data = await response.json()
    return data.data
  }
)

export const deleteDeparture = createAsyncThunk(
  'departures/deleteDeparture',
  async ({ cruiseId, itineraryId, departureId }: { cruiseId: number, itineraryId: number, departureId: number }) => {
    const response = await fetch(`/api/v1/cruise/${cruiseId}/itinerary/${itineraryId}/departure/${departureId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
    })
    if (!response.ok) {
      throw new Error('Failed to delete departure')
    }
    return departureId
  }
)

const departuresSlice = createSlice({
  name: 'departures',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartures.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchDepartures.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchDepartures.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch departures'
      })
      .addCase(createDeparture.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateDeparture.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteDeparture.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload)
      })
  },
})

export const selectDepartures = (state: { departures: DeparturesState }) => state.departures.items
export const selectDeparturesStatus = (state: { departures: DeparturesState }) => state.departures.status
export const selectDeparturesError = (state: { departures: DeparturesState }) => state.departures.error

export default departuresSlice.reducer 