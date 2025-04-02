import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface AuthUser {
  id: number
  name: string
  email: string
  roles: string[]
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null
}

// Función auxiliar para asegurar que roles sea un array
const ensureRolesArray = (roles: any): string[] => {
  if (!roles) return []
  if (Array.isArray(roles)) return roles
  if (typeof roles === 'string') return [roles]
  return []
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const data = await response.json()
    return {
      user: {
        ...data.data.user,
        roles: ensureRolesArray(data.data.user.roles)
      },
      token: data.data.token
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    // Limpiar cookies
    await fetch('/api/auth/logout', {
      method: 'POST',
    })
    return null
  }
)

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async () => {
    const response = await fetch('/api/auth/check')
    if (!response.ok) {
      throw new Error('Auth check failed')
    }

    const data = await response.json()
    return {
      user: {
        ...data.user,
        roles: ensureRolesArray(data.user.roles)
      },
      token: data.token
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Error al iniciar sesión'
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.status = 'idle'
        state.error = null
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.token = action.payload.token
        state.status = 'succeeded'
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null
        state.token = null
        state.status = 'idle'
      })
  }
})

export const selectUser = (state: { auth: AuthState }) => state.auth.user
export const selectIsAuthenticated = (state: { auth: AuthState }) => !!state.auth.user && !!state.auth.token
export const selectAuthStatus = (state: { auth: AuthState }) => state.auth.status
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error

export default authSlice.reducer 