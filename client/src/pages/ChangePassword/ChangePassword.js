import React from 'react';
import { Button, Link, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import styles from './ChangePassword.module.scss';
import background from '../../assets/images/changePassBG.png';
import illustrationError from '../../assets/images/ConfirmEmail_illustrationError.png';
import illustration from '../../assets/images/ConfirmEmail_illustration.png';

import LockIcon from '@mui/icons-material/Lock';

import { fetchCheckToken, fetchChangePassword } from '../../redux/slices/authSlice';

const ChangePassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useParams();

    const { userInfo, error } = useSelector((state) => state.auth);

    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            password: '',
            confirmPassword: ''
        },
        mode: 'onChange'
    });

    const onSubmit = async (values) => {
        console.log(values);
        dispatch(fetchChangePassword({token, values}));
    }

    React.useEffect(() => {
        dispatch(fetchCheckToken(token));
    }, [])
    

    return (
        <main>
            <section>
                <div className={styles.content_box}>
                    {error 
                        ?  <><img src={illustrationError} alt='Illustration'/><p>{error}</p></>
                        :<div className={styles.error}>
                            {userInfo
                                ? <div className={styles.updated}><img src={illustration} alt='Illustration'/><p>{userInfo}</p><Link href='/login'>Go to login</Link></div>
                                : <>
                                    <div className={styles.heading}>
                                        <h1>Change password</h1>
                                        <span>Your new password must be<br/>different from previous</span>
                                    </div>

                                    {error && <Alert severity="error">{error}</Alert>}
                                    {!Object.keys(errors).length == 0 && <Alert severity="warning" className={styles.errmsg}>{Object.values(errors)[0].message}</Alert>}
                                    
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className={styles.inputs}>
                                            <div className={styles.form}>
                                                <label htmlFor='password'>Password</label>
                                                <div className={styles.field}>
                                                    <input type='password' id='password' required
                                                        {...register('password', {
                                                            pattern: {
                                                                value: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
                                                                message: 'Password is not strong enough'
                                                            }
                                                        })}
                                                    />
                                                    <LockIcon></LockIcon>
                                                </div>
                                            </div>
                                            <div className={styles.form}>
                                                <label htmlFor='confirm'>Repeat Password</label>
                                                <div className={styles.field}>
                                                    <input type='password' id='confirm' required
                                                        {...register('confirmPassword', {
                                                            validate: (value) => {
                                                                if (watch('password') != value) {
                                                                    return "Your passwords do no match";
                                                                }
                                                            },
                                                        })}
                                                    />
                                                    <LockIcon></LockIcon>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.button}>
                                            <Button type='submit' variant="contained">Submit</Button>
                                        </div>
                                    </form>
                                </>
                            }
                        </div>}
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

export default ChangePassword;