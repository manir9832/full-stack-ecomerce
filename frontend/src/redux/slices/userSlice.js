import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: null,
    token: localStorage.getItem('token') || null,
  },
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload.user;
      state.token = action.payload.token;
    },
    logoutUser: (state) => {
      state.userInfo = null;
      state.token = null;
      localStorage.clear();
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;