import { configureStore } from '@reduxjs/toolkit';
import { postsReducer } from './slices/posts';
import { categoriesReducer } from './slices/categories';
import { authReducer } from './slices/authSlice';

const store = configureStore({
    reducer: {
        posts: postsReducer,
        categories: categoriesReducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
});

export default store;