import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => {
    console.log('esfesf');
    let { data} = await axios.delete(`/api/posts/${id}`);
    console.log(data);
    return data;
});

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (page, {rejectWithValue}) => {
    try {
        console.log(page);
        if(typeof page == 'string') {
            console.log(page);
            var { data } = await axios.get(`/api/posts${page}`);
        }
        else {
            var { data } = await axios.get(`/api/posts?page=${page}`);
        }
        let arr = data.posts?.map(el => el.authorID);
        let users = await axios.post(`/api/userInfo`, {
            arr: arr
        })

        console.log(data);
        
        return { data, users };
    }
    catch(error) {
        return rejectWithValue(error.response.data);
    }
});

export const fetchCategories = createAsyncThunk('posts/fetchCategories', async () => {
    let { data } = await axios.get(`/api/categories`);
    console.log(await axios.get(`/api/categories`));
    console.log(data);

    return data;
});

const initialState = {
    posts: {
        items: [],
        status: 'loading',
    },
    categories: {
        items: [],
        status: 'loading',
    },
}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducer: {},
    extraReducers: {
        [fetchPosts.pending]: (state) => {
            state.posts.items = [];
            state.posts.status = 'loading'
        },
        [fetchPosts.fulfilled]: (state, action) => {
            state.posts.items = action.payload;
            state.posts.status = 'resolved';
        },
        [fetchPosts.rejected]: (state) => {
            state.posts.items = [];
            state.posts.status = 'rejected';
        },

        [fetchRemovePost.pending]: (state, action) => {
            state.posts.items = state.posts.items.data.posts.filter((obj) => obj.id == action.meta.arg);
        },
    }
});

export const postsReducer = postsSlice.reducer;