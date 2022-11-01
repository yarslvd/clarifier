import React, { useState, useEffect } from 'react';
import { Container, Button, Grid, Pagination, TextField, Box, FormControlLabel, FormGroup, Checkbox, IconButton } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux'

import styles from './Questions.module.scss';
import QuestionCard from '../../components/QuestionCard/QuestionCard';
import Filter from '../../components/Filter/Filter';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm } from 'react-hook-form';

import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';

import { fetchPosts } from '../../redux/slices/posts';
import { fetchCategories } from '../../redux/slices/categories';
import { selectIsAuthMe } from '../../redux/slices/authSlice';

const Questions = () => {
    const dispatch = useDispatch();
    const { posts } = useSelector(state => state.posts);
    const auth = useSelector(selectIsAuthMe);
    const { categories } = useSelector(state => state.categories);
    const { userInfo } = useSelector((state) => state.auth);

    const [query, setQuery] = useState("");
    const [dateValue1, setdateValue1] = useState(null);
    const [dateValue2, setdateValue2] = useState(null);

    const isPostsLoading = posts.status === 'loading';

    let [page, setPage] = useState(1);
    const [dateSorting, setDateSorting] = useState(true);
    const [ratingSorting, setRatingSorting] = useState(false);
    const [iconDate, setIconDate] = useState(true);
    const [iconRating, setIconRating] = useState(true);

    const [filter, setFilter] = useState(false);

    const { register, handleSubmit } = useForm({
        mode: 'onChange'
    })

    const onSubmit = (values) => {
        console.log(values);

        if(values.dataFrom) {
            let arr = values.dataFrom.split('/');
            console.log(arr);
            let newArr = [];
            newArr.push(arr[2]);
            newArr.push(arr[0]);
            newArr.push(arr[1]);
            values.dataFrom = newArr.join('-');
        }
        if(values.dataTo) {
            let arr = values.dataTo.split('/');
            console.log(arr);
            let newArr = [];
            newArr.push(arr[2]);
            newArr.push(arr[0]);
            newArr.push(arr[1]);
            values.dataTo = newArr.join('-');
        }

        if(values.dataFrom && values.dataTo) {
            dispatch(fetchPosts(`?filter[dateFrom]=${values.dataFrom}&filter[dateTo]=${values.dataFrom}`));
            return;
        }
        else if(values.dataFrom || values.dataTo) {
            if(values.dataFrom) {
                dispatch(fetchPosts(`?filter[dateFrom]=${values.dataFrom}`));
                return;
            }
            else {
                dispatch(fetchPosts(`?filter[dateTo]=${values.dataTo}`));
                return;
            }
        }
        console.log(values);

        if(values.category.length == 0 || values.category === false) {
            setFilter(false);
            return dispatch(fetchPosts(page));
        }
        else {
            setFilter(values.category);
            console.log()
            if(page) {
                dispatch(fetchPosts(`?filter[category]=${values.category}&page=${page}`));
                return;
            }
            dispatch(fetchPosts(`?filter[category]=${values.category}`));
            console.log(filter);
            return;
        }
    }

    const date = () => {
        setIconDate(!iconDate);
        if(!dateSorting) {
            setDateSorting(true);
        }
        if(ratingSorting) {
            setRatingSorting(false);
        }

        if(filter) {
            if(!iconDate) {
                dispatch(fetchPosts(`?sort[id]=desc&filter[category]=${filter}`));
                if(page) {
                    dispatch(fetchPosts(`?sort[id]=desc&filter[category]=${filter}&page=${page}`));
                }
            }
            else {
                dispatch(fetchPosts(`?sort[id]=asc&filter[category]=${filter}`));
                if(page) {
                    dispatch(fetchPosts(`?sort[id]=asc&filter[category]=${filter}&page=${page}`));
                }
            }
        }
        else {
            if(!iconDate) {
                dispatch(fetchPosts(`?sort[id]=desc`));
                if(page) {
                    dispatch(fetchPosts(`?sort[id]=desc&page=${page}`));
                }
            }
            else {
                dispatch(fetchPosts(`?sort[id]=asc`));
                if(page) {
                    dispatch(fetchPosts(`?sort[id]=asc&page=${page}`));
                }
            }
        }
    }

    const rating = () => {
        setIconRating(!iconRating);
        if(!ratingSorting) {
            setRatingSorting(true);
        }
        if(dateSorting) {
            setDateSorting(false);
        }

        if(filter) {
            if(!iconRating) {
                dispatch(fetchPosts(`?sort[rating]=desc&filter[category]=${filter}`));
                if(page) {
                    dispatch(fetchPosts(`?sort[rating]=desc&filter[category]=${filter}&page=${page}`));
                }
            }
            else {
                dispatch(fetchPosts(`?sort[rating]=asc&filter[category]=${filter}`));
                if(page) {
                    dispatch(fetchPosts(`?sort[rating]=asc&filter[category]=${filter}&page=${page}`));
                }
            }
        }
        else {
            if(!iconRating) {
                dispatch(fetchPosts(`?sort[rating]=desc`));
                if(page) {
                    dispatch(fetchPosts(`?sort[rating]=desc&page=${page}`));
                }
            }
            else {
                dispatch(fetchPosts(`?sort[rating]=asc`));
                if(page) {
                    dispatch(fetchPosts(`?sort[rating]=asc&page=${page}`));
                }
            }
        }
    }

    useEffect(() => {
        dispatch(fetchPosts(1));
        dispatch(fetchCategories());
    }, []);

    console.log(filter);

    const handleChange = (e, p) => {
        setPage(p);

        console.log(filter);

        if(filter) {
            dispatch(fetchPosts(`?filter[category]=${filter}&page=${p}`));
        }

        if(!iconDate && dateSorting) {
            dispatch(fetchPosts(`?sort[id]=asc&page=${p}`));
        }
        else if(iconDate && dateSorting){
            dispatch(fetchPosts(`?page=${p}`));
        }
        else if(!iconRating && ratingSorting) {
            dispatch(fetchPosts(`?sort[rating]=asc&page=${p}`));
        }
        else if(iconRating && ratingSorting){
            dispatch(fetchPosts(`?sort[rating]=desc&page=${p}`));
        }
    }

    const getLogin = (id) => {
        for(let el of posts.items.users.data) {
            if(el.id === id) {
                return el.login;
            }
        }
        return null;
    }

    const getAvatar = (id) => {
        for(let el of posts.items.users.data) {
            if(el.id === id) {
                return el.profile_img;
            }
        }
        return null;
    }

    return(
        <main>
            <Container maxWidth='xl' className={styles.container}>
                <Grid container spacing={2}>
                    <Grid item md={3} sx={{ display: { xs: 'none', md: 'flex'} }} className={styles.filter_container}>
                        <h2>Filter</h2>
                        <div className={styles.filter}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className={styles.topic_container}>
                                    <h2 className={styles.section_heading}>TOPIC</h2>
                                    <div className={styles.input_topic_container}>
                                        <TextField id="outlined-basic" variant="outlined" className={styles.input_topic} placeholder='Search...' onChange={event => setQuery(event.target.value)}/>
                                        <SearchIcon></SearchIcon>
                                    </div>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            height: 200,
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
                                            categories.items.filter(post => {
                                                if (query === '') {
                                                    return post;
                                                }
                                                else if (post.name.toLowerCase().includes(query.toLowerCase())) {
                                                    return post;
                                                }
                                            }).map((post, index) => (
                                                <FormControlLabel control={<Checkbox />} label={post.name} key={post.id} value={post.id} {...register('category')}/>
                                            ))
                                            }
                                        </FormGroup>
                                    </Box>
                                </div>
                                {/* <div className={styles.date_container}>
                                    <h2 className={styles.section_heading}>DATE INTERVAL</h2>
                                    <div className={styles.input_container}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="From"
                                                value={dateValue1}
                                                onChange={(newValue) => {
                                                    setdateValue1(newValue);
                                                }}
                                                renderInput={(params) => <TextField {...params} sx={{width: '150px', fontSize:'10px'}}
                                                {...register('dataFrom')}/>}
                                            />
                                        </LocalizationProvider>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="To"
                                                value={dateValue2}
                                                onChange={(newValue) => {
                                                    setdateValue2(newValue);
                                                }}
                                                renderInput={(params) => <TextField {...params} sx={{width: '150px', fontSize:'10px'}}
                                                {...register('dataTo')}/>}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div> */}
                                <div className={styles.buttons}>
                                    <Button type='submit' variant='contained' className={styles.confirmBtn}>Save</Button>
                                    <IconButton aria-label="delete" onClick={() => {setdateValue2(null); setdateValue1(null); setQuery(""); }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            </form>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={9} className={styles.right_sidebar}>
                        <div className={styles.heading}>
                            <h1>All Questions</h1>
                            <Button variant='outlined' href={auth ? '/new-question' : '/login'}>Ask</Button>
                        </div>
                        <div className={styles.sorting}>
                            <Button variant='contained' className={!dateSorting ? styles.sortingBtn_active : styles.sortingBtn}
                                onClick={date}>
                                    Date {iconDate ? <NorthIcon></NorthIcon> : <SouthIcon></SouthIcon>}
                            </Button>
                            <Button variant='contained' className={!ratingSorting ? styles.sortingBtn_active : styles.sortingBtn}
                                onClick={rating}>
                                    Rating {iconRating ? <NorthIcon></NorthIcon> : <SouthIcon></SouthIcon>}
                            </Button>
                        </div>
                        <div className={styles.questionsList}>
                            {(isPostsLoading ? [...Array(5)] : posts.items.data.posts).map((el, index) =>
                                isPostsLoading ? (
                                    <QuestionCard key={index} isLoading={true} />
                                ) : (
                                    <QuestionCard
                                        id={el.id}
                                        title={el.title}
                                        avatar={getAvatar(el.authorID)}
                                        username={getLogin(el.authorID)}
                                        content={el.content}
                                        date={el.publishDate}
                                        rating={el.rating}
                                        key={index}
                                        link={el.authorID}
                                        isEditable={userInfo?.id == el.authorID}
                                    />
                                )
                            )}
                            {!isPostsLoading && <Pagination count={posts.items.data.totalPages} page={page} color="primary"  sx={{ mt: '50px', mb: '100px' }} onChange={handleChange}/>}
                        </div>
                    </Grid>
                    <Grid item lg={1} sx={{ display: { xs: 'none', lg: 'flex'} }}></Grid>
                </Grid>
            </Container>
        </main>
    );
}

export default Questions;