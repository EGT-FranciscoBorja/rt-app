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

const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN

// Validar configuración al inicio
if (!API_TOKEN) {
  console.error('NEXT_PUBLIC_API_TOKEN is not configured')
}

export const fetchCruises = createAsyncThunk(
  'cruises/fetchCruises',
  async ({ page, filters }: FetchCruisesParams) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        ...(filters.name && { name: filters.name }),
        ...(filters.category && { category: filters.category }),
        ...(filters.priceMin && { priceMin: filters.priceMin }),
        ...(filters.priceMax && { priceMax: filters.priceMax }),
        ...(filters.capacityMin && { capacityMin: filters.capacityMin }),
        ...(filters.capacityMax && { capacityMax: filters.capacityMax })
      })

      const response = await fetch(`/api/cruises?${queryParams.toString()}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Error fetching cruises:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        })
        throw new Error(errorData.message || 'Error al obtener los cruceros')
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.message || 'Error al obtener los cruceros')
      }

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
        console.error('Error fetching cruises:', action.error.message || action.payload)
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