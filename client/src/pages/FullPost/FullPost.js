import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { Avatar, Container, Button, Link } from '@mui/material';

import styles from './FullPost.module.scss';
import Comment from '../../components/Comment/Comment';

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import GradeIcon from '@mui/icons-material/Grade';
import axios from '../../redux/axios';
import { selectIsAuthMe } from '../../redux/slices/authSlice';

const FullPost = () => {
    const [postData, setPostData] = useState();
    const [categoryData, setCategoryData] = useState();
    const [commentsData, setCommentsData] = useState();
    const [usersData, setUsersData] = useState();
    const [like, setLike] = useState(false);
    const [dislike, setDislike] = useState(false);
    const [likesCounter, setLikesCounter] = useState(null);

    const [isLoadingPost, setLoadingPost] = useState(true);
    const [isLoadingCategories, setLoadingCategories] = useState(true);
    const [isLoadingComments, setLoadingComments] = useState(true);
    const [isLoadingUsers, setLoadingUsers] = useState(true);

    const auth = useSelector(selectIsAuthMe);
    console.log(auth);


    const { userInfo } = useSelector((state) => state.auth);

    const { id } = useParams(); 

    useEffect(() => {
        axios.get(`/api/posts/${id}`).then(res => {
            setPostData(res.data);
            setLikesCounter(res.data.rating);
            setLoadingPost(false);
        }).catch(err => {
            console.error(err);
            alert('Error');
        });

        axios.get(`api/posts/${id}/categories`).then(res => {
            setCategoryData(res.data);
            setLoadingCategories(false);
        }).catch(err => {
            console.error(err);
            alert('Error');
        });

        axios.get(`/api/posts/${id}/comments`).then(res => {
            setCommentsData(res.data);
            setLoadingComments(false);
        }).catch(err => {
            console.error(err);
            alert('Error'); 
        });
    }, []);

    useEffect(() => {
        if(!isLoadingComments && !isLoadingPost) {
            let arr = commentsData.map(el => el.authorID);
            arr.push(postData.authorID);

            axios.post(`/api/userInfo`, { arr: arr }).then(res => {
                setUsersData(res.data);
                setLoadingUsers(false);
            }).catch(err => {
                console.error(err);
                alert('error');
            });
        }
    }, [!isLoadingComments]);

    useEffect(() => {
        if(auth) {
            axios.get(`/api/posts/${id}/like`).then(res => {
                if(res.data.length === 0){
                    return;
                }
                else {
                    for(let el of res.data) {
                        if(el.authorID === userInfo.id) {
                            if(el.type == 'dislike') {
                                return setDislike(true);
                            }
                            if(el.type == 'like') {
                                return setLike(true);
                            }
                        }
                    }
                }
            }).catch(error => {
                console.log(error);
            });
        }
    }, [auth]);

    const addLike = () => {
        if(!like && !dislike) {
            axios.post(`/api/posts/${id}/like`, { type: 'like'}).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            });
            setLikesCounter(likesCounter + 1);
        }
        else {
            if(!dislike) {
                axios.delete(`/api/posts/${id}/like`, { type: 'like'}).then(res => {
                    console.log(res);
                }).catch(err => {
                    console.log(err);
                });
                setLikesCounter(likesCounter - 1);
            }
        }
        setLike(!like);
        if(dislike) {
            axios.post(`/api/posts/${id}/like`, { type: 'like'}).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            });
            setDislike(!dislike);
            setLikesCounter(likesCounter + 2);
        }
    }

    const addDislike = () => {
        if(!dislike && !like) {
            axios.post(`/api/posts/${id}/like`, { type: 'dislike'}).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            });
            setLikesCounter(likesCounter - 1);
        }
        else {
            if(!like) {
                axios.delete(`/api/posts/${id}/like`, { type: 'dislike'}).then(res => {
                    console.log(res);
                }).catch(err => {
                    console.log(err);
                });
                setLikesCounter(likesCounter + 1);
            }
        }
        setDislike(!dislike);
        if(like) {
            axios.post(`/api/posts/${id}/like`, { type: 'dislike'}).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            });
            setLike(!like);
            setLikesCounter(likesCounter - 2);
        }
    }

    const getLogin = (id) => {
        if(!isLoadingUsers) {
            for(let el of usersData) {
                if(el.id === id) {
                    return el.login;
                }
            }
            return null;
        }
    }

    const getAvatar = (id) => {
        if(!isLoadingUsers) {
            for(let el of usersData) {
                if(el.id === id) {
                    return el.profile_img;
                }
            }
            return null;
        }
    }

    const { register, handleSubmit } = useForm({
        defaultValues: {
            content: ''
        },
        mode: 'onChange'
    });

    const onSubmit = (values) => {
        values.authorID = userInfo.id;

        axios.post(`/api/posts/${id}/comments`, values).then(res => {
            console.log(res);
            window.location.reload();
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <main>
            <Container sx={{display: 'flex', flexDirection: 'column'}}>
                {!isLoadingPost && 
                    <div className={styles.question_container}>
                        <div className={styles.heading}>
                            <h1>{postData.title}</h1>
                            <span>{postData.publishDate}</span>
                        </div>
                        <div className={styles.text}>
                            {postData.content}
                        </div>
                        {!isLoadingCategories &&
                            <div className={styles.categories}>
                                {categoryData.map((el, index) => {
                                    return <span key={index}>{el}</span>
                                })}
                            </div>
                        }
                        <div className={styles.question_info}>
                            <div className={styles.user}>
                                <Avatar src={`http://localhost:8000/${getAvatar(postData.authorID)}`} alt="user avatar"/>
                                <Link href={`/users/${postData.authorID}`}>{getLogin(postData.authorID)}</Link> 
                            </div>
                            <div className={styles.likes}>
                                <div className={styles.rating}>
                                    <GradeIcon></GradeIcon>
                                    <span>{likesCounter}</span>
                                </div>

                                {auth
                                    ?
                                    <>
                                        <Button className={like ? styles.item_active : styles.item} onClick={addLike}><ThumbUpIcon></ThumbUpIcon>Like</Button>
                                        <Button className={dislike ? styles.item_active : styles.item} onClick={addDislike}><ThumbDownIcon></ThumbDownIcon>Dislike</Button>
                                    </>
                                    :
                                    <>
                                        <Button className={styles.item} href='/login'><ThumbUpIcon></ThumbUpIcon>Like</Button>
                                        <Button className={styles.item} href='/login'><ThumbDownIcon></ThumbDownIcon>Dislike</Button>
                                    </>
                                }
                            </div>
                        </div>
                    </div>}
                    <div className={styles.answers}>
                        <h2>Answers</h2>
                        <div className={styles.answers_container}>
                            {!isLoadingComments &&
                                (commentsData === []
                                    ? <p>No answers found. Be first!</p>
                                    : commentsData.map((el, index) => {
                                        return <Comment 
                                                    _id={el.id}
                                                    authorID={el.authorID}
                                                    postID={el.postID}
                                                    publishDate={el.publishDate}
                                                    content={el.content}
                                                    key={index}
                                                    login={getLogin(el.authorID)}
                                                    avatar={getAvatar(el.authorID)}
                                                    commentsData={commentsData}
                                                    link = {el.authorID}
                                                />
                                        })
                                    )
                            }
                        </div>
                        <div className={styles.write}>
                            <span>Your answer</span>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <textarea type="text" placeholder="Write your answer..." {...register('content', {
                                    required: true,
                                    minLength: 5
                                })}></textarea>
                                {auth ? <Button type='submit' variant='contained'>Post</Button> : <Button href='/login' variant='contained'>Log In</Button>}
                            </form>
                        </div>
                    </div>
            </Container>
        </main>
    );
}

export default FullPost;