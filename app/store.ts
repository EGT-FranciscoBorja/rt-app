import { configureStore } from '@reduxjs/toolkit'
import cruisesReducer from './lib/features/cruises/cruisesSlice'
import cabinsReducer from './lib/features/cabins/cabinsSlice'
import usersReducer from './lib/features/users/usersSlice'

export const store = configureStore({
  reducer: {
    cruises: cruisesReducer,
    cabins: cabinsReducer,
    users: usersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
