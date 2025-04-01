import { configureStore } from '@reduxjs/toolkit'
import { enableMapSet } from 'immer'
import cruisesReducer from './features/cruises/cruisesSlice'
import cabinsReducer from './features/cabins/cabinsSlice'
import itinerariesReducer from './features/itineraries/itinerariesSlice'
import departuresReducer from './features/departures/departuresSlice'
import usersReducer from './features/users/usersSlice'
import itinerariesPricesReducer from './features/itineraries/itinerariesPricesSlice'
import chartersReducer from './features/charters/chartersSlice'

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

interface CabinState {
  items: Array<{
    id: number
    name: string
    description: string
    cruise_id: number
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
    name: string
    days: number
    cruise_id: number
    created_at: string
    updated_at: string
  }>
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

interface DepartureState {
  items: Array<{
    id: number
    start_date: string
    end_date: string
    cruise_itinerary_id: number
    created_at: string
    updated_at: string
  }>
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

interface UserState {
  items: Array<{
    id: number
    name: string
    email: string
    created_at: string
    updated_at: string
  }>
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

interface PriceState {
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

export interface RootState {
  cruises: CruiseState
  cabins: CabinState
  itineraries: ItineraryState
  departures: DepartureState
  users: UserState
  itinerariesPrices: PriceState
  charters: {
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
}

export const store = configureStore({
  reducer: {
    cruises: cruisesReducer,
    cabins: cabinsReducer,
    itineraries: itinerariesReducer,
    departures: departuresReducer,
    users: usersReducer,
    itinerariesPrices: itinerariesPricesReducer,
    charters: chartersReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

// Infer the type of store
export type AppStore = typeof store
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch