import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

interface Price {
  id: number
  cruise_cabin_id: number
  cruise_itinerary_id: number
  price: number
  created_at: string
  updated_at: string
}

interface PricesState {
  items: Price[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: PricesState = {
  items: [],
  status: 'idle',
  error: null
}

export const fetchPrices = createAsyncThunk(
  'itinerariesPrices/fetchPrices',
  async ({ cruiseId, itineraryId }: { cruiseId: number; itineraryId: number }) => {
    const response = await axios.get(`https://api.rtapi.lat/api/v1/cruise/${cruiseId}/itinerary/${itineraryId}/price`)
    return response.data.data
  }
)

export const createPrice = createAsyncThunk(
  'itinerariesPrices/createPrice',
  async ({ cruiseId, itineraryId, priceData }: { cruiseId: number; itineraryId: number; priceData: { cruise_cabin_id: number; price: number } }) => {
    const response = await axios.post(`https://api.rtapi.lat/api/v1/cruise/${cruiseId}/itinerary/${itineraryId}/price`, priceData)
    return response.data.data
  }
)

export const updatePrice = createAsyncThunk(
  'itinerariesPrices/updatePrice',
  async ({ cruiseId, itineraryId, priceId, priceData }: { cruiseId: number; itineraryId: number; priceId: number; priceData: { price: number } }) => {
    const response = await axios.put(`https://api.rtapi.lat/api/v1/cruise/${cruiseId}/itinerary/${itineraryId}/price/${priceId}`, priceData)
    return response.data.data
  }
)

export const deletePrice = createAsyncThunk(
  'itinerariesPrices/deletePrice',
  async ({ cruiseId, itineraryId, priceId }: { cruiseId: number; itineraryId: number; priceId: number }) => {
    await axios.delete(`https://api.rtapi.lat/api/v1/cruise/${cruiseId}/itinerary/${itineraryId}/price/${priceId}`)
    return priceId
  }
)

const itinerariesPricesSlice = createSlice({
  name: 'itinerariesPrices',
  initialState,
  reducers: {
    clearPrices: (state) => {
      state.items = []
      state.status = 'idle'
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrices.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchPrices.fulfilled, (state, action) => {
        state.status = 'succeeded'
        console.log('Precios recibidos en el reducer:', action.payload)
        
        // Asegurarse de que los precios nuevos no dupliquen los existentes
        const newPrices = action.payload.filter((newPrice: Price) => 
          !state.items.some(existingPrice => existingPrice.id === newPrice.id)
        )
        
        console.log('Precios nuevos a agregar:', newPrices)
        state.items = [...state.items, ...newPrices]
        console.log('Estado final de precios:', state.items)
      })
      .addCase(fetchPrices.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch prices'
        console.error('Error en fetchPrices:', action.error)
      })
      .addCase(createPrice.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updatePrice.fulfilled, (state, action) => {
        const index = state.items.findIndex(price => price.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deletePrice.fulfilled, (state, action) => {
        state.items = state.items.filter(price => price.id !== action.payload)
      })
  }
})

export const { clearPrices } = itinerariesPricesSlice.actions

export const selectPrices = (state: { itinerariesPrices: PricesState }) => state.itinerariesPrices.items
export const selectPricesStatus = (state: { itinerariesPrices: PricesState }) => state.itinerariesPrices.status
export const selectPricesError = (state: { itinerariesPrices: PricesState }) => state.itinerariesPrices.error

export default itinerariesPricesSlice.reducer
