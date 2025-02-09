import { createSlice } from '@reduxjs/toolkit';

export const navbarSlice = createSlice({
    name: 'navbar',
    initialState: {
        navtext: null,
    },
    reducers: {
        setNavText: (state, action) => {
            state.navtext = action.payload;
            // console.log(state.navtext);
        },
    },
});

export const { setNavText } = navbarSlice.actions;

export const getNavText = (state) => state.navtext;
export default navbarSlice.reducer;
