import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface Cabin {
  id: number
  name: string
  cruise_id: number
  quantity: number
  base_price: number
  created_at: string
  updated_at: string
}

interface CabinState {
  items: Cabin[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: CabinState = {
  items: [],
  status: 'idle'
}

const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN

// Validate configuration at startup
if (!API_TOKEN) {
  console.error('NEXT_PUBLIC_API_TOKEN is not configured')
}

export const fetchCabins = createAsyncThunk(
  'cabins/fetchCabins',
  async (cruiseId: number) => {
    if (!API_TOKEN) {
      throw new Error('API configuration is incomplete. Please check your environment variables.')
    }

    try {
      console.log('Making API request with token:', API_TOKEN.substring(0, 10) + '...')
      
      const response = await fetch(`/api/v1/cruise/${cruiseId}/cabin`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`,
        },
        credentials: 'include',
        mode: 'cors',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData,
          url: `/api/v1/cruise/${cruiseId}/cabin`,
          headers: Object.fromEntries(response.headers.entries()),
          token: API_TOKEN.substring(0, 10) + '...'
        })
        
        if (response.status === 403) {
          throw new Error('You are not authorized to access this resource. Please check your API token.')
        }
        
        if (response.status === 502) {
          throw new Error('Server connection error. Please try again in a few moments.')
        }
        
        throw new Error(`Failed to fetch cabins: ${response.status}`)
      }

      const result = await response.json()
      console.log('API Response:', result)

      if (!result.success) {
        throw new Error(result.message || 'Error fetching cabins')
      }

      return result.data
    } catch (error) {
      console.error('Error in fetchCabins:', error)
      throw error
    }
  }
)

const cabinsSlice = createSlice({
  name: 'cabins',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCabins.pending, (state) => {
        state.status = 'loading'
        state.items = [] // Clear items during loading
      })
      .addCase(fetchCabins.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchCabins.rejected, (state, action) => {
        state.status = 'failed'
        state.items = []
        console.error('Error fetching cabins:', action.error.message || action.payload)
      })
  },
})

export const selectCabins = (state: { cabins: CabinState }) => {
  const items = state.cabins.items
  return Array.isArray(items) ? items : []
}

export const selectCabinsStatus = (state: { cabins: CabinState }) => state.cabins.status

export default cabinsSlice.reducer
