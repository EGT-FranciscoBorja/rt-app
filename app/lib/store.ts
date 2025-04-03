import { configureStore } from '@reduxjs/toolkit'
import { enableMapSet } from 'immer'
import cruisesReducer from './features/cruises/cruisesSlice'
import cabinsReducer from './features/cabins/cabinsSlice'
import itinerariesReducer from './features/itineraries/itinerariesSlice'
import departuresReducer from './features/departures/departuresSlice'
import usersReducer from './features/users/usersSlice'
import itinerariesPricesReducer from './features/itineraries/itinerariesPricesSlice'
import chartersReducer from './features/charters/chartersSlice'
import hotelsReducer from './features/hotels/hotelSlice'
import hotelRoomsReducer from './features/hotelRooms/hotelRoomsSlice'
import authReducer from './features/auth/authSlice'
import seasonsReducer from './features/seasons/seasonSlice'
import adviceReducer, { AdviceState } from './features/advices/adviceSlice'

// Habilitar el plugin MapSet de Immer
enableMapSet()

interface CruiseState {
  items: Array<{
    id: number
    name: string
    description: string
    website: string
    capacity: number
    base_price: number
    category: number
    created_at: string
    updated_at: string
  }>
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  pagination: {
    current_page: number
    last_page: number
    total: number
    per_page: number
  }
}

interface UserState {
  items: Array<{
    id: number
    name: string
    email: string
    password: string
    roles: string
    created_at: string
    updated_at: string
  }>
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  pagination: {
    current_page: number
    last_page: number
    total: number
    per_page: number
  }
}

interface CabinState {
  items: Array<{
    id: number
    name: string
    description: string
    capacity: number
    price: number
    created_at: string
    updated_at: string
  }>
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  tempCabins: Array<{
    id?: number
    name: string
    quantity: string
    base_price: string
  }>
}

interface ItineraryState {
  items: Array<{
    id: number
    cruise_id: number
    name: string
    days: number
    created_at: string
    updated_at: string
  }>
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

interface DepartureState {
  items: Array<{
    id: number
    cruise_itinerary_id: number
    start_date: string
    end_date: string
    created_at: string
    updated_at: string
  }>
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

interface ItineraryPriceState {
  items: Array<{
    id: number
    cruise_cabin_id: number
    cruise_itinerary_id: number
    price: number
    created_at: string
    updated_at: string
  }>
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

interface CharterState {
  items: Array<{
    id: number
    name: string
    description: string
    persons: number
    price: number
    created_at: string
    updated_at: string
  }>
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

interface HotelState {
  items: Array<{
    id: number
    name: string
    description: string
    website: string
    country: string
    city: string
    location: string
    base_price: number
    category: number
    created_at: string
    updated_at: string
  }>
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  currentPage: number
  totalPages: number
  totalItems: number
}

interface HotelRoomState {
  items: Array<{
    id: number
    hotel_id: number
    name: string
    description: string
    quantity: number
    base_price: number
    maximum_persons: number
    created_at: string
    updated_at: string
  }>
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

interface AuthState {
  user: {
    id: number
    name: string
    email: string
    roles: string[]
  } | null
  token: string | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

interface SeasonState {
  items: Array<{
    id: number
    name: string
    description: string
    start_date: string
    end_date: string
    percentage: number
    created_at: string
    updated_at: string
  }>
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  currentPage: number
  totalPages: number
  totalItems: number
}

export interface RootState {
  cruises: CruiseState
  users: UserState
  cabins: CabinState
  itineraries: ItineraryState
  departures: DepartureState
  itinerariesPrices: ItineraryPriceState
  charters: CharterState
  hotels: HotelState
  hotelRooms: HotelRoomState
  auth: AuthState
  seasons: SeasonState
  advice: AdviceState
}

export const store = configureStore({
  reducer: {
    cruises: cruisesReducer,
    users: usersReducer,
    cabins: cabinsReducer,
    itineraries: itinerariesReducer,
    departures: departuresReducer,
    itinerariesPrices: itinerariesPricesReducer,
    charters: chartersReducer,
    hotels: hotelsReducer,
    hotelRooms: hotelRoomsReducer,
    auth: authReducer,
    seasons: seasonsReducer,
    advice: adviceReducer
  },
})

export type AppDispatch = typeof store.dispatch