import { configureStore } from '@reduxjs/toolkit'
import cruisesReducer from './features/crusies/cruisesSlice'
import cabinsReducer from './features/cabins/cabinsSlice'
import itinerariesReducer from './features/itineraries/itinerariesSlice'
import departuresReducer from './features/departures/departuresSlice'
import usersReducer from './features/users/usersSlice'

export const store = configureStore({
  reducer: {
    cruises: cruisesReducer,
    cabins: cabinsReducer,
    itineraries: itinerariesReducer,
    departures: departuresReducer,
    users: usersReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

// Infer the type of store
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch