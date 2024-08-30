// src/redux/categorySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    activeCategoryId: null,
    isComplete: false
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setActiveCategoryId: (state, action) => {
            state.activeCategoryId = action.payload;
            // console.log(state.activeCategoryId)
        },
        setCompleteItem : (state, action) => {
            state.isComplete = action.payload
            // console.log("dispatch",state.isComplete)
        }
    },
});

export const { setActiveCategoryId, setCompleteItem } = categorySlice.actions;
export default categorySlice.reducer;
