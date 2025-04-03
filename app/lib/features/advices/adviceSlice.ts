import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

export interface AdviceResponse {
  id: number;
  advice: string;
}

export const fetchAdvice = createAsyncThunk(
  'advice/fetchAdvice',
  async () => {
    const response = await fetch('https://api.adviceslip.com/advice');
    const data = await response.json();
    return data.slip as AdviceResponse;
  }
);

export interface AdviceState {
  value: string;
  id: number;
}

const initialState: AdviceState = {
  value: '',
  id: 0,
};

export const adviceSlice = createSlice({
  name: 'advice',
  initialState,
  reducers: {
    setValueAndId: (state, action: PayloadAction<AdviceState>) => {
      state.value = action.payload.value;
      state.id = action.payload.id;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAdvice.fulfilled, (state, action) => {
      state.value = action.payload.advice;
      state.id = action.payload.id;
    });
  }
});

export const { setValueAndId } = adviceSlice.actions;

export const selectAdvice = (state: RootState) => state.advice.value;
export const selectAdviceId = (state: RootState) => state.advice.id;

export default adviceSlice.reducer;