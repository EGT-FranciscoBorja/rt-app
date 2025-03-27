import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface Cruise {
  id: number
  name: string
  description: string
  website: string
  capacity: number
  base_price: number
  category: number
  created_at: string
  updated_at: string
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

// Función auxiliar para obtener el token
const getApiToken = () => {
  const token = process.env.NEXT_PUBLIC_API_TOKEN
  if (!token) {
    console.error('API Token no encontrado en las variables de entorno')
    console.log('Variables de entorno disponibles:', Object.keys(process.env))
  }
  return token
}

export const fetchCruises = createAsyncThunk(
  'cruises/fetchCruises',
  async () => {
    try {
      console.log('Fetching cruises...')
      const API_TOKEN = getApiToken()
      
      if (!API_TOKEN) {
        throw new Error('API Token no configurado')
      }

      console.log('API Token:', API_TOKEN.substring(0, 5) + '...')

      const response = await fetch('/api/v1/cruise', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`,
        },
      })
      
      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`Failed to fetch cruises: ${response.status} ${errorText}`)
      }

      const result = await response.json()
      console.log('API Response:', result)

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch cruises')
      }

      return result.data
    } catch (error) {
      console.error('Error in fetchCruises:', error)
      throw error
    }
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