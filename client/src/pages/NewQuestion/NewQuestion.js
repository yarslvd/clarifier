import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { IconButton, Container, Button, TextField, Box, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

import styles from './NewQuestion.module.scss';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';

import { selectIsAuth } from '../../redux/slices/authSlice';
import axios from '../../redux/axios';


const NewQuestion = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const auth = useSelector(selectIsAuth);
    console.log(auth);
    const { userInfo } = useSelector((state) => state.auth);

    const [query, setQuery] = useState("");

    const [categories, setCategories] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const [isLoadedEdit, setIsLoadedEdit] = useState(false);

    const [title, setTitle] = useState();

    const { register, handleSubmit } = useForm({
        mode: 'onChange'
    });

    useEffect(() => {
        if(!auth) {
            navigate('/login');
        }

        axios.get(`/api/categories`).then(res => {
            setCategories(res.data);
            setIsLoading(false);
        }).then(err => {
            console.log(err);
        });

    }, []);

    useEffect(() => {
        if(id) {
            axios.get(`/api/posts/${id}`).then(res => {
                console.log(res.data.title);
                setTitle(res.data.title);
                console.log(title);
                setIsLoadedEdit(true);
            }).catch(err => {
                navigate('/questions');
                console.log(err);
            });
        }
    }, [])

    const onSubmit = (values) => {
        console.log(values);
        axios.post('/api/posts/', values).then(res => {
            console.log(res.data.id);
            navigate(`/questions/${res.data.id}`);
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <main>
            <Container sx={{display: 'flex', flexDirection: 'column'}}>
                <div className={styles.heading}>
                    <IconButton onClick={() => navigate(-1)} aria-label='go back' className={styles.backBtn}><ArrowBackIcon/></IconButton>
                    <h1>New Question</h1>
                </div>
                <div className={styles.container}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.main}>
                            <textarea rows="1" className={styles.title} placeholder='Title' onChange={(e) => setTitle(e.target.value)} {...register('title', { required: true, minLength: 5 })}>{(title == 'undefined' && auth) ? null : title}</textarea>
                            <textarea className={styles.content} placeholder='Write down your question...' {...register('content', { required: true, minLength: 20 })}></textarea>
                            <Button type='submit' variant='contained'>Post</Button>
                        </div>
                        <div className={styles.topic}>
                            <div className={styles.input_topic_container}>
                                <TextField id="outlined-basic" variant="outlined" className={styles.input_topic} placeholder='Search...' onChange={event => setQuery(event.target.value)}/>
                                <SearchIcon></SearchIcon>
                            </div>
                            {!isLoading
                                &&
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        height: '525px',
                                        overflow: "hidden",
                                        overflowY: "scroll",
                                        backgroundColor: '#EFEFEF',
                                        padding: '20px',
                                        borderRadius: '10px'
                                        }}
                                    className={styles.scrollBox}
                                    >
                                    <FormGroup>
                                        {
                                        categories.filter(post => {
                                            if (query === '') {
                                                return post;
                                            }
                                            else if (post.name.toLowerCase().includes(query.toLowerCase())) {
                                                return post;
                                            }
                                        }).map((post, index) => (
                                            <FormControlLabel control={<Checkbox />} label={post.name} key={post.id} value={post.id} {...register('category', { required: true })}/>
                                        ))
                                        }
                                    </FormGroup>
                                </Box>
                            }
                        </div>
                    </form>
                </div>
            </Container>
        </main>
    );
}

export default NewQuestion;