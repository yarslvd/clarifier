import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import { Avatar, Button, Container, IconButton, Modal, Box, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GradeIcon from '@mui/icons-material/Grade';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';

import styles from './Profile.module.scss';
import QuestionCard from '../../components/QuestionCard/QuestionCard';
import { selectIsAuth } from '../../redux/slices/authSlice';
import axios from '../../redux/axios';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#fff',
    borderRadius: '20px',
    p: 4,
};

const Profile = () => {
    const navigate = useNavigate();
    const auth = useSelector(selectIsAuth);
    const { userInfo } = useSelector((state) => state.auth);

    const [posts, setPosts] = useState();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [error, setError] = useState();
    const [data, setData] = useState();
    const inputFileRef = React.useRef(null);

    useEffect(() => {
        if(!auth) {
            navigate('/login');
        }
    }, []);

    useEffect(() => {
        if(userInfo) {
            axios.get(`/api/posts/authorID/${userInfo.id}`).then(res => {
                console.log(res.data.rows);
                setPosts(res.data.rows);
            }).catch(err => {
                console.log(err);
            })
        }
    }, [userInfo]);

    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            login: '',
            password: '',
            passwordRepeat: '',
            fullname: ''
        },
        mode: 'onChange'
    });

    const onSubmit = (values) => {
        for(let el in values) {
            if(values[el] == '') {
                delete values[el];
            }
        }

        axios.patch(`/api/users/${userInfo.id}`, values).then(res => {
            console.log(res.data);
            setData(res.data);
        }).catch(err => {
            setError(err.response.data);
            console.log(err);
        })
    }

    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0];
            formData.append('image', file);
            const { data } = await axios.patch('/api/users/avatar', formData);
            console.log(data);
        }
        catch(err) {
            console.log(err);
            alert('Error while setting new profile picture!');
        }
    }

    return (
        <main>
            <Container sx={{display: 'flex', flexDirection: 'column'}}>
                <div className={styles.user}>
                    <div className={styles.heading}>
                        <IconButton onClick={() => navigate(-1)} aria-label='go back' className={styles.backBtn}><ArrowBackIcon/></IconButton>
                        <h1>Profile</h1>
                    </div>
                    {userInfo &&
                        <div className={styles.user_container}>
                            <Avatar src={`http://localhost:8000/${userInfo.profile_img}`} alt={userInfo.fullname} className={styles.avatar}></Avatar>
                            <h3>{userInfo.fullname}</h3>
                            <span>@{userInfo.login}</span>
                            <div className={styles.rating}><GradeIcon></GradeIcon>{userInfo.rating}</div>
                            <Button variant='outlined' onClick={handleOpen}>Settings</Button>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                className={styles.modal}
                            >
                                <Box sx={style} className={styles.modal}>
                                    <div className={styles.heading}>
                                        <IconButton onClick={handleClose} aria-label='go back' className={styles.backBtn}><ArrowBackIcon/></IconButton>
                                        <h1>Profile</h1>
                                    </div>
                                    <form onSubmit={handleSubmit(onSubmit)}>

                                        {!Object.keys(errors).length == 0 && <Alert severity="warning" className={styles.errmsg}>{Object.values(errors)[0].message}</Alert>}
                                        {error && <Alert severity="error" className={styles.errmsg}>{error}</Alert>}
                                        {data && window.location.reload() && <Alert severity="success" className={styles.errmsg}>{data}</Alert>}

                                        <div className={styles.button}>
                                            <Button variant="outlined" onClick={() => inputFileRef.current.click()}>Change Avatar</Button>
                                            <input ref={inputFileRef} type='file' onChange={handleChangeFile} hidden></input>
                                        </div>
                                        <div className={styles.inputs}>
                                            <div className={styles.form}>
                                                <label htmlFor='username'>Username</label>
                                                <div className={styles.field}>
                                                    <input type='text' id='username' {...register('login')}/>
                                                    <PersonIcon></PersonIcon>
                                                </div>
                                            </div>
                                            <div className={styles.form}>
                                                <label htmlFor='name'>Full Name</label>
                                                <div className={styles.field}>
                                                    <input type='text' id='name'
                                                        {...register('fullname', {
                                                            pattern: {
                                                                value: /^([\w]{2,})+\s+([\w\s]{2,})+$/i,
                                                                message: 'Please, enter your real name'
                                                            }
                                                        })}
                                                    />
                                                    <BadgeIcon></BadgeIcon>
                                                </div>
                                            </div>
                                            <div className={styles.form}>
                                                <label htmlFor='password'>Password</label>
                                                <div className={styles.field}>
                                                    <input type='password' id='password'
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
                                                    <input type='password' id='confirm'
                                                        {...register('passwordRepeat', {
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
                                            <Button variant="contained" type='submit'>Submit</Button>
                                        </div>
                                    </form>
                                </Box>
                            </Modal>
                        </div>
                    }
                </div>
                <div className={styles.posts}>
                    <h3>Created Posts</h3>
                    <div className={styles.posts_container}>
                        {posts && 
                            posts.map((el, index) => {
                                return <QuestionCard
                                    id={el.id}
                                    title={el.title}
                                    avatar={userInfo.profile_img}
                                    username={userInfo.login}
                                    content={el.content}
                                    date={el.publishDate}
                                    rating={el.rating}
                                    key={index}
                                    link={el.authorID}
                                />
                            })
                        }
                    </div>
                </div>
            </Container>
        </main>
    );
}

export default Profile;