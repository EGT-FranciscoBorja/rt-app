import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export interface Charter {
  id: number
  name: string
  description: string
  persons: number
  price: number
  created_at: string
  updated_at: string
}

interface ChartersState {
  items: Charter[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: ChartersState = {
  items: [],
  status: 'idle',
  error: null
}

export const fetchCharters = createAsyncThunk(
  'charters/fetchCharters',
  async ({ cruiseId, itineraryId }: { cruiseId: number; itineraryId: number }) => {
    const response = await axios.get(`/api/v1/cruise/${cruiseId}/itinerary/${itineraryId}/charter`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      }
    })
    return response.data.data
  }
)

export const createCharter = createAsyncThunk(
  'charters/createCharter',
  async ({ cruiseId, itineraryId, charterData }: { cruiseId: number; itineraryId: number; charterData: { name: string; description: string; persons: number; price: number } }) => {
    const response = await axios.post(`/api/v1/cruise/${cruiseId}/itinerary/${itineraryId}/charter`, charterData, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      }
    })
    return response.data.data
  }
)

export const updateCharter = createAsyncThunk(
  'charters/updateCharter',
  async ({ cruiseId, itineraryId, charterId, charterData }: { cruiseId: number; itineraryId: number; charterId: number; charterData: { name: string; description: string; persons: number; price: number } }) => {
    const response = await axios.put(`/api/v1/cruise/${cruiseId}/itinerary/${itineraryId}/charter/${charterId}`, charterData, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      }
    })
    return response.data.data
  }
)

export const deleteCharter = createAsyncThunk(
  'charters/deleteCharter',
  async ({ cruiseId, itineraryId, charterId }: { cruiseId: number; itineraryId: number; charterId: number }) => {
    await axios.delete(`/api/v1/cruise/${cruiseId}/itinerary/${itineraryId}/charter/${charterId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      }
    })
    return charterId
  }
)

const chartersSlice = createSlice({
  name: 'charters',
  initialState,
  reducers: {
    clearCharters: (state) => {
      state.items = []
      state.status = 'idle'
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharters.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCharters.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchCharters.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch charters'
      })
      .addCase(createCharter.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateCharter.fulfilled, (state, action) => {
        const index = state.items.findIndex(charter => charter.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteCharter.fulfilled, (state, action) => {
        state.items = state.items.filter(charter => charter.id !== action.payload)
      })
  }
})

export const { clearCharters } = chartersSlice.actions

export const selectCharters = (state: { charters: ChartersState }) => state.charters.items
export const selectChartersStatus = (state: { charters: ChartersState }) => state.charters.status
export const selectChartersError = (state: { charters: ChartersState }) => state.charters.error

export default chartersSlice.reducer 