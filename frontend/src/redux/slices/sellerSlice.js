import { createSlice } from '@reduxjs/toolkit';

const sellerSlice = createSlice({
  name: 'seller',
  initialState: {
    sellerData: null,
  },
  reducers: {
    setSellerData: (state, action) => {
      state.sellerData = action.payload;
    },
  },
});

export const { setSellerData } = sellerSlice.actions;
export default sellerSlice.reducer;