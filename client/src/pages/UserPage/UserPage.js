import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import { Avatar, Button, Container, IconButton, Modal, Box, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GradeIcon from '@mui/icons-material/Grade';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';

import styles from './UserPage.module.scss';
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

const UserPage = () => {
    const navigate = useNavigate();
    const auth = useSelector(selectIsAuth);
    const { userInfo } = useSelector((state) => state.auth);
    const { id } = useParams();

    const [posts, setPosts] = useState();
    const [user, setUser] = useState();

    useEffect(() => {
        if(!auth) {
            navigate('/login');
        }

        axios.get(`/api/users/publicInfo/${id}`).then(res => {
            console.log(res.data);
            setUser(res.data);
        }).catch(err => {
            console.log(err);
        })
    }, []);

    useEffect(() => {
        if(userInfo) {
            if(userInfo.id == id) {
                navigate('/profile');
            }

            axios.get(`/api/posts/authorID/${id}`).then(res => {
                console.log(res.data.rows);
                setPosts(res.data.rows);
            }).catch(err => {
                console.log(err);
            })
        }
    }, [userInfo]);

    return (
        <main>
            <Container sx={{display: 'flex', flexDirection: 'column'}}>
                <div className={styles.user}>
                    <div className={styles.heading}>
                        <IconButton onClick={() => navigate(-1)} aria-label='go back' className={styles.backBtn}><ArrowBackIcon/></IconButton>
                        <h1>Profile</h1>
                    </div>
                    {user &&
                        <div className={styles.user_container}>
                            <Avatar src={`http://localhost:8000/${user.profile_img}`} alt={user.fullname}className={styles.avatar}></Avatar>
                            <h3>{user.fullname}</h3>
                            <span>@{user.login}</span>
                            <div className={styles.rating}><GradeIcon></GradeIcon>{user.rating}</div>
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
                                    avatar={user.profile_img}
                                    username={user.login}
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

export default UserPage;