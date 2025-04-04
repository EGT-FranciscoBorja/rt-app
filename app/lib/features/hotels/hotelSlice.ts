import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Hotel } from '@/app/lib/types/hotel'
import { RootState } from '../../store'

interface HotelState {
  items: Hotel[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  currentPage: number
  totalPages: number
  totalItems: number
}

const initialState: HotelState = {
  items: [],
  status: 'idle',
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0
}

export const fetchHotels = createAsyncThunk(
  'hotels/fetchHotels',
  async (page: number = 1) => {
    const response = await fetch(`/api/v1/hotel?page=${page}`, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        'Accept': 'application/json',
      }
    })
    if (!response.ok) {
      const error = await response.text()
      throw new Error(error)
    }
    const responseData = await response.json()
    if (!responseData.success) {
      throw new Error(responseData.message || 'Error loading hotels')
    }
    return responseData.data
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
        state.error = null
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const hotels = Array.isArray(action.payload.data) ? action.payload.data : []
        state.items = hotels.map((hotel: Hotel) => ({
          ...hotel,
          seasons: hotel.seasons || [],
          cancel_policies: hotel.cancel_policies || []
        }))
        state.currentPage = action.payload.current_page || 1
        state.totalPages = action.payload.last_page || 1
        state.totalItems = action.payload.total || 0
        state.error = null
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Error loading hotels'
      })
  }
})

// Selectores
export const selectHotels = (state: RootState) => state.hotels.items
export const selectHotelsStatus = (state: RootState) => state.hotels.status
export const selectHotelsError = (state: RootState) => state.hotels.error
export const selectHotelsPagination = (state: RootState) => ({
  currentPage: state.hotels.currentPage,
  totalPages: state.hotels.totalPages,
  totalItems: state.hotels.totalItems
})

export const { setItems } = hotelSlice.actions
export default hotelSlice.reducer
