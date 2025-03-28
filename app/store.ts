import { configureStore } from '@reduxjs/toolkit'
import cruisesReducer from './lib/features/crusies/cruisesSlice'

export const store = configureStore({
  reducer: {
    cruises: cruisesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
