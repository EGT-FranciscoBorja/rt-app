import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Hotel {
  id: number
  name: string
  city: string
  country: string
  web: string
  phones: string[]
  email: string
  contact: string
  category: string
  room_type: string
  room_category: string
  net_price: number
  holiday_price: number
  year: number
}

export const HotelSlice = createSlice({
  name: 'hotels',
  initialState: [] as Hotel[],
  reducers: {
    addHotel: (state, action: PayloadAction<Hotel>) => {
      state.push(action.payload)
    },
    removeHotel: (state, action: PayloadAction<number>) => {
      return state.filter((hotel) => hotel.id !== action.payload)
    },
  },

})

export const { addHotel, removeHotel } = HotelSlice.actions

export default HotelSlice.reducer
