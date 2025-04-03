import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface CancelPolicy {
  id: number
  name: string
  description: string
  days: number
  percentage: number
  created_at: string
  updated_at: string
}

export interface CancelPolicyState {
  items: CancelPolicy[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  currentPage: number
  totalPages: number
  totalItems: number
}

const initialState: CancelPolicyState = {
  items: [],
  status: 'idle',
  currentPage: 1,
  totalPages: 1,
  totalItems: 0
}

export const fetchCancelPolicies = createAsyncThunk(
  'cancelPolicies/fetchCancelPolicies',
  async (page: number = 1) => {
    const response = await fetch(`/api/v1/cancelPolicy?page=${page}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
    })
    if (!response.ok) {
      throw new Error('Failed to fetch cancel policies')
    }
    const data = await response.json()
    return data.data
  }
)

const cancelPolicySlice = createSlice({
  name: 'cancelPolicies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCancelPolicies.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCancelPolicies.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.data
        state.currentPage = action.payload.current_page
        state.totalPages = action.payload.last_page
        state.totalItems = action.payload.total
      })
      .addCase(fetchCancelPolicies.rejected, (state) => {
        state.status = 'failed'
      })
  }
})

export const selectCancelPolicies = (state: { cancelPolicies: CancelPolicyState }) => state.cancelPolicies.items
export const selectCancelPoliciesStatus = (state: { cancelPolicies: CancelPolicyState }) => state.cancelPolicies.status

export default cancelPolicySlice.reducer 