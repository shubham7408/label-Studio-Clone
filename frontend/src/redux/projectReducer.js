import { createSlice } from '@reduxjs/toolkit';

export const projectSlice = createSlice({
    name: 'project',
    initialState: {
        project: null,
    },
    reducers: {
        setProject: (state, action) => {
            state.project = action.payload;
        },
        
    },
});

export const { setProject } = projectSlice.actions;

export const getProject = (state) => state.project.project;
export default projectSlice.reducer;
