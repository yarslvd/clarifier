import React from 'react';
import { IconButton, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import styles from './ResetPassword.module.scss';
import background from '../../assets/images/ResetBG.png';

import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { fetchResetPassword } from '../../redux/slices/authSlice';

const ResetPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email:''
        },
        mode: 'onChange'
    });

    const onSubmit = async (values) => {
        console.log(values);
        dispatch(fetchResetPassword(values));
    }

    return(
        <main>
            <section>
                <div className={styles.content_box}>
                    <IconButton onClick={() => navigate(-1)} aria-label='go back' className={styles.backBtn}><ArrowBackIcon/></IconButton>
                    <div className={styles.heading}>
                        <h1>Reset password</h1>
                        <span>Enter the email address associated<br/>with your account</span>
                    </div>
                    {!Object.keys(errors).length == 0 && <Alert severity="warning" className={styles.errmsg}>{Object.values(errors)[0].message}</Alert>}
                    {userInfo && <Alert severity="success" className={styles.errmsg}>We sent an email if the email is associated with your account</Alert>}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.inputs}>
                            <div className={styles.form}>
                                <label htmlFor='email'>Email</label>
                                <div className={styles.field}>
                                    <input type='email' id='email' {...register('email', {
                                                pattern: {
                                                    value: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                                                    message: 'Please, enter a valid email'
                                                }
                                            })}
                                    />
                                    <EmailIcon></EmailIcon>
                                </div>
                            </div>
                        </div>
                        <div className={styles.button}>
                            <Button type='submit' variant="contained">Send</Button>
                        </div>
                    </form>
                </div>
                <div className={styles.image_box}>
                    <div className={styles.text}>
                        <h2>clarifier.</h2>
                        <span>A place to share knowledge and<br/>better understand the world</span>
                    </div>
                    <img src={background} alt='background'/>
                </div>
            </section>
        </main>
    );
}

export default ResetPassword;