import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../../store'

export interface User {
  id: number
  name: string
  email: string
  password: string
  roles: string
  created_at: string
  updated_at: string
}

interface UserFilters {
  name: string
  email: string
  role: string
}

interface UserState {
  items: User[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  pagination: {
    current_page: number
    last_page: number
    total: number
    per_page: number
  }
}

interface FetchUsersParams {
  page: number
  filters: UserFilters
}

const initialState: UserState = {
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

if (!API_TOKEN) {
  console.error('NEXT_PUBLIC_API_TOKEN is not configured')
}

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page, filters }: FetchUsersParams) => {
    if (!API_TOKEN) {
      throw new Error('API configuration is incomplete. Please check your environment variables.')
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      ...(filters.name && { name: filters.name }),
      ...(filters.email && { email: filters.email }),
      ...(filters.role && { role: filters.role })
    })

    const response = await fetch(`/api/v1/users?${queryParams}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }

    return response.json()
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading'
        state.items = []
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = Array.isArray(action.payload.data) ? action.payload.data : []
        state.pagination = {
          current_page: action.payload.current_page,
          last_page: action.payload.last_page,
          total: action.payload.total,
          per_page: action.payload.per_page
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.items = []
        console.error('Error fetching users:', action.error.message || action.payload)
      })
  },
})

export const selectUsers = (state: RootState) => state.users.items
export const selectUsersStatus = (state: RootState) => state.users.status
export const selectPagination = (state: RootState) => state.users.pagination

export default usersSlice.reducer