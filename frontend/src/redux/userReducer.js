import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        employee: null
    },
    reducers: {
        setUser: (state, action) => {
            state.employee= action.payload
            // console.log(state.employee)
        },
    },
})

export const { setUser } = userSlice.actions

export default userSlice.reducer