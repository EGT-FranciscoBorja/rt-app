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

interface Itinerary {
  id: number
  cruise_id: number
  name: string
  days: number
  created_at: string
  updated_at: string
}

interface PricesState {
  items: Price[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

interface RootState {
  itinerariesPrices: PricesState
  itineraries: {
    items: Itinerary[]
    status: string
    error: string | null
  }
}

const initialState: PricesState = {
  items: [],
  status: 'idle',
  error: null
}

export const fetchPrices = createAsyncThunk(
  'itinerariesPrices/fetchPrices',
  async ({ cruiseId, itineraryId }: { cruiseId: number; itineraryId: number }) => {
    const response = await axios.get(`/api/v1/cruise/${cruiseId}/itinerary/${itineraryId}/price`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      }
    })
    return response.data.data
  }
)

export const createPrice = createAsyncThunk(
  'itinerariesPrices/createPrice',
  async ({ cruiseId, itineraryId, priceData }: { cruiseId: number; itineraryId: number; priceData: { cruise_cabin_id: number; price: number } }) => {
    const response = await axios.post(`/api/v1/cruise/${cruiseId}/itinerary/${itineraryId}/price`, priceData, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      }
    })
    return response.data.data
  }
)

export const updatePrice = createAsyncThunk(
  'itinerariesPrices/updatePrice',
  async ({ priceId, priceData }: { priceId: number; priceData: { price: number } }, { getState }) => {
    const numericPrice = Number(priceData.price)
    
    if (isNaN(numericPrice) || numericPrice <= 0) {
      throw new Error('The price must be a positive number')
    }

    const state = getState() as RootState
    const originalPrice = state.itinerariesPrices.items.find(
      (price: Price) => price.id === priceId
    )

    if (!originalPrice) {
      throw new Error('An original price was not found')
    }

    const itinerary = state.itineraries.items.find(
      (it: Itinerary) => it.id === originalPrice.cruise_itinerary_id
    )

    if (!itinerary) {
      throw new Error('The itinerary was not found')
    }

    try {
      const response = await axios.put(
        `/api/v1/cruise/${itinerary.cruise_id}/itinerary/${originalPrice.cruise_itinerary_id}/price/${priceId}`,
        { 
          price: numericPrice,
          cruise_cabin_id: originalPrice.cruise_cabin_id
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`
          }
        }
      )

      if (!response.data.success) {
        throw new Error(response.data.message || 'Error al actualizar el precio')
      }

      return response.data.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error de respuesta:', error.response?.data)
        throw new Error(error.response?.data?.message || 'Error al actualizar el precio')
      }
      throw error
    }
  }
)

export const deletePrice = createAsyncThunk(
  'itinerariesPrices/deletePrice',
  async ({ cruiseId, itineraryId, priceId }: { cruiseId: number; itineraryId: number; priceId: number }) => {
    await axios.delete(`/api/v1/cruise/${cruiseId}/itinerary/${itineraryId}/price/${priceId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      }
    })
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
