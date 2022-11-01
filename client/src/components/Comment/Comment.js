import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Avatar, Button, Link } from '@mui/material';

import styles from './Comment.module.scss';

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

import { selectIsAuthMe } from '../../redux/slices/authSlice';
import axios from '../../redux/axios';

const Comment = ({ _id, authorID, postID, publishDate, content, login, avatar, commentsData }) => {
    const [like, setLike] = useState(false);
    const [dislike, setDislike] = useState(false);

    const { userInfo } = useSelector((state) => state.auth);
    const auth = useSelector(selectIsAuthMe);
    console.log(auth);

    const { id } = useParams(); 

    useEffect(() => {
        if(auth) {
            axios.get(`/api/comments/${_id}/like`).then(res => {
                console.log(res.data);
                if(res.data.length === 0){
                    return;
                }
                else {
                    for(let el of res.data) {
                        console.log(el);
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
            axios.post(`/api/comments/${_id}/like`, { type: 'like'}).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            });
        }
        else {
            if(!dislike) {
                axios.delete(`/api/comments/${_id}/like`, { type: 'like'}).then(res => {
                    console.log(res);
                }).catch(err => {
                    console.log(err);
                });
            }
        }
        setLike(!like);
        if(dislike) {
            axios.post(`/api/comments/${_id}/like`, { type: 'like'}).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            });
            setDislike(!dislike);
        }
    }

    const addDislike = () => {
        if(!dislike && !like) {
            axios.post(`/api/comments/${_id}/like`, { type: 'dislike'}).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            });
        }
        else {
            if(!like) {
                axios.delete(`/api/comments/${_id}/like`, { type: 'dislike'}).then(res => {
                    console.log(res);
                }).catch(err => {
                    console.log(err);
                });
            }
        }
        setDislike(!dislike);
        if(like) {
            axios.post(`/api/comments/${_id}/like`, { type: 'dislike'}).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            });
            setLike(!like);
        }
    }

    console.log(avatar);

    return (
        <div className={styles.commentContainer}>
            <p className={styles.text}>
                {content}
            </p>
            <div className={styles.info}>
                <div className={styles.user}>
                    <span className={styles.publishDate}>{publishDate}</span>
                    <Avatar src={`http://localhost:8000/${avatar}`} alt='user avatar'/>
                    <Link className={styles.login} href={`/users/${authorID}`}>{login}</Link> 
                </div>
                <div className={styles.likes}>
                    <Button className={like ? styles.item_active : styles.item} onClick={addLike}><ThumbUpIcon></ThumbUpIcon></Button>
                    <Button className={dislike ? styles.item_active : styles.item} onClick={addDislike}><ThumbDownIcon></ThumbDownIcon></Button>
                </div>
            </div>
        </div>
    );
}

export default Comment;