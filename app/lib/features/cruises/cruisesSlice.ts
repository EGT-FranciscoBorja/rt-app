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
    if (!API_TOKEN) {
      throw new Error('API configuration is incomplete. Please check your environment variables.')
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      ...(filters.name && { name: filters.name }),
      ...(filters.category && { category: filters.category }),
      ...(filters.priceMin && { price_min: filters.priceMin }),
      ...(filters.priceMax && { price_max: filters.priceMax }),
      ...(filters.capacityMin && { capacity_min: filters.capacityMin }),
      ...(filters.capacityMax && { capacity_max: filters.capacityMax })
    })

    try {
      console.log('Making API request with token:', API_TOKEN.substring(0, 10) + '...')
      
      const response = await fetch(`/api/v1/cruise?${queryParams.toString()}`, {
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
          url: `/api/v1/cruise?${queryParams.toString()}`,
          headers: Object.fromEntries(response.headers.entries()),
          token: API_TOKEN.substring(0, 10) + '...'
        })
        
        if (response.status === 403) {
          throw new Error('No tienes autorización para acceder a este recurso. Por favor, verifica tu token de API.')
        }
        
        if (response.status === 502) {
          throw new Error('Error de conexión con el servidor. Por favor, intenta nuevamente en unos momentos.')
        }
        
        throw new Error(`Failed to fetch cruises: ${response.status}`)
      }

      const result = await response.json()
      console.log('API Response:', result)

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