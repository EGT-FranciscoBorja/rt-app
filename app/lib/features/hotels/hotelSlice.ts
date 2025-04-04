import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Hotel } from '@/app/lib/types/hotel'

interface HotelState {
  items: Hotel[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  currentPage: number
  totalPages: number
  totalItems: number
}

const initialState: HotelState = {
  items: [],
  status: 'idle',
  currentPage: 1,
  totalPages: 1,
  totalItems: 0
}

export const fetchHotels = createAsyncThunk(
  'hotels/fetchHotels',
  async (page: number = 1) => {
    const response = await fetch(`/api/hotels?page=${page}`)
    if (!response.ok) {
      throw new Error('Failed to fetch hotels')
    }
    const data = await response.json()
    return data.data
  }
)

const hotelSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.data.map((hotel: Hotel) => ({
          ...hotel,
          seasons: hotel.seasons || [],
          cancel_policies: hotel.cancel_policies || []
        }))
        state.currentPage = action.payload.current_page
        state.totalPages = action.payload.last_page
        state.totalItems = action.payload.total
      })
      .addCase(fetchHotels.rejected, (state) => {
        state.status = 'failed'
      })
  }
})

export const { setItems } = hotelSlice.actions
export default hotelSlice.reducer
