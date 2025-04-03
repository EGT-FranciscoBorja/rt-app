import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface Season {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  percentage: number
  created_at: string
  updated_at: string
}

interface SeasonState {
  items: Season[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  currentPage: number
  totalPages: number
  totalItems: number
  error: string | null
}

const initialState: SeasonState = {
  items: [],
  status: 'idle',
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  error: null
}

export const fetchSeasons = createAsyncThunk(
  'seasons/fetchSeasons',
  async (page: number = 1) => {
    const response = await fetch(`/api/seasons?page=${page}`)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch seasons')
    }
    
    return data
  }
)

const seasonSlice = createSlice({
  name: 'seasons',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeasons.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchSeasons.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.data
        state.currentPage = action.payload.current_page
        state.totalPages = action.payload.last_page
        state.totalItems = action.payload.total
        state.error = null
      })
      .addCase(fetchSeasons.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch seasons'
      })
  }
})

export default seasonSlice.reducer 