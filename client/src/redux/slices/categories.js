import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
    let { data } = await axios.get(`/api/categories`);
    // console.log(await axios.get(`/api/categories`));
    // console.log(data);
    return data;
});

const initialState = {
    categories: {
        items: [],
        status: 'loading',
    },
}

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducer: {},
    extraReducers: {
        [fetchCategories.pending]: (state) => {
            state.categories.items = [];
            state.categories.status = 'loading'
        },
        [fetchCategories.fulfilled]: (state, action) => {
            state.categories.items = action.payload;
            state.categories.status = 'loaded';
        },
        [fetchCategories.rejected]: (state) => {
            state.categories.items = [];
            state.categories.status = 'error';
        }
    }
});

export const categoriesReducer = categoriesSlice.reducer;