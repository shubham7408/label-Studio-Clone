import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
  message: '',
  type: '',
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showAlert: (state, action) => {
      const { message, type } = action.payload;
      state.open = true;
      state.message = message;
      state.type = type;
    },
    hideAlert: (state) => {
      state.open = false;
      state.message = '';
      state.type = '';
    },
  },
});

export const { showAlert, hideAlert } = alertSlice.actions;

export default alertSlice.reducer;
