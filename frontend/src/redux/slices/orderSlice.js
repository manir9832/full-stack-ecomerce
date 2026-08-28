import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    activeOrder: null,
  },
  reducers: {
    setActiveOrder: (state, action) => {
      state.activeOrder = action.payload;
    },
  },
});

export const { setActiveOrder } = orderSlice.actions;
export default orderSlice.reducer;