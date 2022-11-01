import React from 'react';
import { Link, Button, IconButton, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import styles from './Login.module.scss';
import background from '../../assets/images/LoginBG.png';

import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { fetchLogin } from '../../redux/slices/authSlice';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo, error } = useSelector((state) => state.auth);

    const { register, handleSubmit } = useForm({
        defaultValues: {
            login: '',
            password: ''
        },
        mode: 'onChange'
    });

    const onSubmit = async (values) => {
        dispatch(fetchLogin(values));
    }

    React.useEffect(() => {
        if (userInfo) {
            navigate('/questions');
        }
    }, [userInfo])

    return (
        <main>
            <section>
                <div className={styles.content_box}>
                    <IconButton onClick={() => navigate(-1)} aria-label='go back' className={styles.backBtn}><ArrowBackIcon/></IconButton>
                    <div className={styles.heading}>
                        <h1>Login</h1>
                        <span>Welcome back! Please login to your<br/>account</span>
                    </div>

                    {error && <Alert severity="error">{error}</Alert>}
                    
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.inputs}>
                            <div className={styles.form}>
                                <label>Username</label>
                                <div className={styles.field}>
                                    <input type='text' {...register('login', { required: 'Input username' })}/>
                                    <PersonIcon></PersonIcon>
                                </div>
                            </div>
                            <div className={styles.form}>
                                <label>Password</label>
                                <div className={styles.field}>
                                    <input type='password' {...register('password', { required: 'Input password' })}/>
                                    <LockIcon></LockIcon>
                                </div>
                                <Link href='/reset-password'>Forgot password?</Link>
                            </div>
                        </div>
                        <div className={styles.button}>
                            <Button variant="contained" type='submit'>Login</Button>
                            <span>Don’t have an account?</span>
                            <Link href='/signup'>Sign up</Link>
                        </div>
                    </form>
                </div>
                <div className={styles.image_box}>
                    <div className={styles.text}>
                        <h2>clarifier.</h2>
                        <span>A place to share knowledge and<br/>better understand the world</span>
                    </div>
                    <img src={background} alt=''/>
                </div>
            </section>
        </main>
    );
}

export default Login;