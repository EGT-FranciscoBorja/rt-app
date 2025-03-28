import { configureStore } from '@reduxjs/toolkit'
import cruisesReducer from './lib/features/crusies/cruisesSlice'
import cabinsReducer from './lib/features/cabins/cabinsSlice'

export const store = configureStore({
  reducer: {
    cruises: cruisesReducer,
    cabins: cabinsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
