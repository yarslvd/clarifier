import React from 'react';
import Cookies from 'js-cookie';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Main from './pages/Main/Main';
import Questions from './pages/Questions/Questions';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import ConfirmEmail from './pages/ConfirmEmail/ConfirmEmail';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import FullPost from './pages/FullPost/FullPost';
import NewQuestion from './pages/NewQuestion/NewQuestion';
import Profile from './pages/Profile/Profile';
import UserPage from './pages/UserPage/UserPage';
import Notes from './pages/Notes/Notes';

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { appTheme } from "./theme";
import { useDispatch, useSelector } from 'react-redux';

import { fetchAuthMe, selectIsAuth } from './redux/slices/authSlice';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />
    },
    {
        path: '/questions',
        element: <Questions />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/signup',
        element: <Signup />
    },
    {
        path: '/reset-password',
        element: <ResetPassword />
    },
    {
        path: '/confirm/:token',
        element: <ConfirmEmail />
    },
    {
        path: '/reset-password/:token',
        element: <ChangePassword />
    },
    {
        path: '/questions/:id',
        element: <FullPost />
    },
    {
        path: '/new-question',
        element: <NewQuestion />
    },
    {
        path: '/profile',
        element: <Profile />
    },
    {
        path: '/users/:id',
        element: <UserPage />
    },
    {
        path: '/questions/:id/edit',
        element: <NewQuestion />
    },
    {
        path: '/notes',
        element: <Notes />
    }
]);

const userToken = Cookies.get('token') ? Cookies.get('token') : null;

function App() {
    const dispatch = useDispatch();
    let path = router.state.location.pathname;
    const arr = ['/login', '/signup', '/reset-password'];

    const auth = useSelector(selectIsAuth);
    console.log(auth);

    React.useEffect(() => {
        if(auth) {
            dispatch(fetchAuthMe(userToken));
        }
    }, [])
    

    return (
        <>
            <ThemeProvider theme={appTheme}>
                <CssBaseline enableColorScheme />
                {(!arr.includes(path) && path.substring(0, 9) != '/confirm/' && path.substring(0, 16) != '/reset-password/') ? <><Header /><RouterProvider router={router}/><Footer /></> : <RouterProvider router={router}/>}
            </ThemeProvider>
        </>
    );
}

export default App;