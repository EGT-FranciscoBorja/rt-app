import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface HotelRoom {
  id: number
  hotel_id: number
  name: string
  description: string
  quantity: number
  base_price: number
  maximum_persons: number
  created_at: string
  updated_at: string
}

interface HotelRoomFilters {
  name: string
  priceMin: string
  priceMax: string
  capacity: string
}

interface HotelRoomState {
  items: HotelRoom[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

interface FetchHotelRoomsParams {
  hotelId: number
  filters: HotelRoomFilters
}

const initialState: HotelRoomState = {
  items: [],
  status: 'idle',
  error: null
}

export const fetchHotelRooms = createAsyncThunk(
  'hotelRooms/fetchHotelRooms',
  async ({ hotelId, filters }: FetchHotelRoomsParams) => {
    try {
      const queryParams = new URLSearchParams({
        hotelId: hotelId.toString(),
        ...(filters.name && { name: filters.name }),
        ...(filters.priceMin && { price_min: filters.priceMin }),
        ...(filters.priceMax && { price_max: filters.priceMax }),
        ...(filters.capacity && { capacity: filters.capacity })
      })

      console.log('Fetching rooms from:', `/api/rooms?${queryParams.toString()}`)

      const response = await fetch(`/api/rooms?${queryParams.toString()}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Error al obtener las habitaciones')
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.message || 'Error al obtener las habitaciones')
      }

      return result.data
    } catch (error) {
      console.error('Error in fetchHotelRooms:', error)
      throw error
    }
  }
)

export const createHotelRoom = createAsyncThunk(
  'hotelRooms/createHotelRoom',
  async ({ hotelId, roomData }: { hotelId: number, roomData: Omit<HotelRoom, 'id' | 'created_at' | 'updated_at'> }) => {
    try {
      const response = await fetch(`/api/rooms?hotelId=${hotelId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Error al crear la habitación')
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.message || 'Error al crear la habitación')
      }

      return result.data
    } catch (error) {
      console.error('Error in createHotelRoom:', error)
      throw error
    }
  }
)

export const updateHotelRoom = createAsyncThunk(
  'hotelRooms/updateHotelRoom',
  async ({ hotelId, roomId, roomData }: { hotelId: number, roomId: number, roomData: Partial<HotelRoom> }) => {
    try {
      const response = await fetch(`/api/hotels/${hotelId}/rooms/${roomId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Error al actualizar la habitación')
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.message || 'Error al actualizar la habitación')
      }

      return result.data
    } catch (error) {
      console.error('Error in updateHotelRoom:', error)
      throw error
    }
  }
)

export const deleteHotelRoom = createAsyncThunk(
  'hotelRooms/deleteHotelRoom',
  async ({ hotelId, roomId }: { hotelId: number, roomId: number }) => {
    try {
      const response = await fetch(`/api/hotels/${hotelId}/rooms/${roomId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Error al eliminar la habitación')
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.message || 'Error al eliminar la habitación')
      }

      return roomId
    } catch (error) {
      console.error('Error in deleteHotelRoom:', error)
      throw error
    }
  }
)

const hotelRoomsSlice = createSlice({
  name: 'hotelRooms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Hotel Rooms
      .addCase(fetchHotelRooms.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchHotelRooms.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchHotelRooms.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Error al obtener las habitaciones'
      })
      // Create Hotel Room
      .addCase(createHotelRoom.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      // Update Hotel Room
      .addCase(updateHotelRoom.fulfilled, (state, action) => {
        const index = state.items.findIndex(room => room.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      // Delete Hotel Room
      .addCase(deleteHotelRoom.fulfilled, (state, action) => {
        state.items = state.items.filter(room => room.id !== action.payload)
      })
  },
})

export const selectHotelRooms = (state: { hotelRooms: HotelRoomState }) => state.hotelRooms.items
export const selectHotelRoomsStatus = (state: { hotelRooms: HotelRoomState }) => state.hotelRooms.status
export const selectHotelRoomsError = (state: { hotelRooms: HotelRoomState }) => state.hotelRooms.error

export default hotelRoomsSlice.reducer 