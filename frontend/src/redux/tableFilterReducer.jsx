import { createSlice } from '@reduxjs/toolkit';

export const tableFilterSlice = createSlice({
    name: 'tableFilter',
    initialState: {
        dataLength: 0,
        currentPage: 1,
        itemsPerPage: 10,
        start: 0,
        sortOrder: true,
        sortingColumn: 'questionId',
        columnNames: [],
        visibleColumns: [],
        isLoading: false,
    },
    reducers: {
        setDataLength: (state, action) => {
            state.dataLength = action.payload;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
            state.start = (state.currentPage - 1) * state.itemsPerPage;
        },
        setItemsPerPage: (state, action) => {
            state.itemsPerPage = action.payload;
            state.start = (state.currentPage - 1) * state.itemsPerPage;
        },
        setSortOrder: (state, action) => {
            state.sortOrder = action.payload;
        },
        setColumnNames: (state, action) => {
            state.columnNames = action.payload;
        },
        setSortingColumn: (state, action) => {
            state.sortingColumn = action.payload;
        },
        getTableFilterState: (state) => {
            return state;
        },
        setVisibleColumns: (state, action) => {
            state.visibleColumns = action.payload;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        updateVisibleColumns: (state, action) => {
            const { key } = action.payload;
            state.visibleColumns = state.visibleColumns.map((col) => {
                const colKey = Object.keys(col)[0];
                if (colKey === key) {
                    return { [colKey]: !col[colKey] };
                }
                return col;
            });
        },
    },
});


export const {
    setDataLength,
    setCurrentPage,
    setItemsPerPage,
    setSortOrder,
    setColumnNames,
    setSortingColumn,
    getTableFilterState,
    setIsLoading,
    setVisibleColumns,
    updateVisibleColumns
} = tableFilterSlice.actions;

export default tableFilterSlice.reducer;
