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

interface CruiseFilters {
  name: string
  category: string
  priceMin: string
  priceMax: string
  capacityMin: string
  capacityMax: string
}

interface CruiseState {
  items: Cruise[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  pagination: {
    current_page: number
    last_page: number
    total: number
    per_page: number
  }
}

interface FetchCruisesParams {
  page: number
  filters: CruiseFilters
}

const initialState: CruiseState = {
  items: [],
  status: 'idle',
  pagination: {
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10
  }
}

// Función auxiliar para obtener el token

export const fetchCruises = createAsyncThunk(
  'cruises/fetchCruises',
  async ({ page, filters }: FetchCruisesParams) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      ...(filters.name && { name: filters.name }),
      ...(filters.category && { category: filters.category }),
      ...(filters.priceMin && { price_min: filters.priceMin }),
      ...(filters.priceMax && { price_max: filters.priceMax }),
      ...(filters.capacityMin && { capacity_min: filters.capacityMin }),
      ...(filters.capacityMax && { capacity_max: filters.capacityMax })
    })

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
    const apiToken = process.env.NEXT_PUBLIC_API_TOKEN || ''

    if (!apiUrl || !apiToken) {
      console.error('API URL or Token not configured')
      throw new Error('API configuration missing')
    }

    try {
      const response = await fetch(`${apiUrl}/api/v1/cruise?${queryParams}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiToken}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        })
        throw new Error(`Failed to fetch cruises: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      console.log('API Response:', result)

      return {
        data: result.data?.data || [],
        current_page: result.data?.current_page || 1,
        last_page: result.data?.last_page || 1,
        total: result.data?.total || 0,
        per_page: result.data?.per_page || 10
      }
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
        state.items = [] // Limpiar los items durante la carga
      })
      .addCase(fetchCruises.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = Array.isArray(action.payload.data) ? action.payload.data : []
        state.pagination = {
          current_page: action.payload.current_page,
          last_page: action.payload.last_page,
          total: action.payload.total,
          per_page: action.payload.per_page
        }
      })
      .addCase(fetchCruises.rejected, (state, action) => {
        state.status = 'failed'
        state.items = []
        console.error('Error fetching cruises:', action.error.message)
      })
  },
})

export const selectCruises = (state: { cruises: CruiseState }) => {
  const items = state.cruises.items
  return Array.isArray(items) ? items : []
}

export const selectCruisesStatus = (state: { cruises: CruiseState }) => state.cruises.status
export const selectPagination = (state: { cruises: CruiseState }) => state.cruises.pagination

export default cruisesSlice.reducer 