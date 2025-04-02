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

export interface RootState {
  cruises: CruiseState
  users: UserState
  cabins: CabinState
  itineraries: ItineraryState
  departures: DepartureState
  itinerariesPrices: ItineraryPriceState
  charters: CharterState
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
  },
})

export type AppDispatch = typeof store.dispatch