import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

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
}

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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/hotel?page=${page}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
    })
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.data
        state.currentPage = action.payload.current_page
        state.totalPages = action.payload.last_page
        state.totalItems = action.payload.total
      })
      .addCase(fetchHotels.rejected, (state) => {
        state.status = 'failed'
      })
  }
})

export default hotelSlice.reducer
