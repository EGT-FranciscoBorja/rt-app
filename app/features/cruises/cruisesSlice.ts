import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface Cruise {
  id: number
  name: string
  description: string
  destination: string
  duration: string
  price: number
  capacity: number
  departureDate: string
  arrivalDate: string
}

interface CruisesState {
  items: Cruise[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: CruisesState = {
  items: [],
  status: 'idle',
  error: null,
}

export const fetchCruises = createAsyncThunk(
  'cruises/fetchCruises',
  async () => {
    const response = await fetch('https://api.tukantek.com/api/cruises')
    if (!response.ok) {
      throw new Error('Failed to fetch cruises')
    }
    return response.json()
  }
)

const cruisesSlice = createSlice({
  name: 'cruises',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCruises.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCruises.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchCruises.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch cruises'
      })
  },
})

export const selectCruisesStatus = (state: { cruises: CruisesState }) => state.cruises.status
export const selectCruises = (state: { cruises: CruisesState }) => state.cruises.items
export const selectCruisesError = (state: { cruises: CruisesState }) => state.cruises.error

export default cruisesSlice.reducer 