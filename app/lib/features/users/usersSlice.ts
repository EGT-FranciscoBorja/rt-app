import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface User {
  id: number
  name: string
  email: string
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

    try {
      const response = await fetch(`/api/v1/user?${queryParams.toString()}`, {
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
          url: `/api/v1/user?${queryParams.toString()}`,
          headers: Object.fromEntries(response.headers.entries()),
          token: API_TOKEN.substring(0, 10) + '...'
        })
        
        throw new Error(`Failed to fetch users: ${response.status}`)
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.message || 'Error fetching users')
      }
      console.log(result.data)
      return {
        data: result.data?.data || [],
        current_page: result.data?.current_page || 1,
        last_page: result.data?.last_page || 1,
        total: result.data?.total || 0,
        per_page: result.data?.per_page || 10
      }
    } catch (error) {
      console.error('Error in fetchUsers:', error)
      throw error
    }
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

export const selectUsers = (state: { users: UserState }) => {
  const items = state.users.items
  return Array.isArray(items) ? items : []
}

export const selectUsersStatus = (state: { users: UserState }) => state.users.status
export const selectPagination = (state: { users: UserState }) => state.users.pagination

export default usersSlice.reducer