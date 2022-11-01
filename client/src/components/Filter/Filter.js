import React, { useState } from 'react';
import { TextField, Box, FormControlLabel, FormGroup, Checkbox, Button, IconButton } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm } from 'react-hook-form';

import { useSelector } from 'react-redux'

import styles from './Filter.module.scss';

import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';

const Filter = () => {
    const { categories } = useSelector(state => state.categories);

    const [query, setQuery] = useState("");
    const [dateValue1, setdateValue1] = useState(null);
    const [dateValue2, setdateValue2] = useState(null);

    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            login: '',
            password: '',
            passwordRepeat: '',
            email: '',
            fullname: ''
        },
        mode: 'onChange'
    })

    return (
        <div className={styles.filter}>
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
                            <FormControlLabel control={<Checkbox />} label={post.name} key={post.id}/>
                        ))
                        }
                    </FormGroup>
                </Box>
            </div>
            <div className={styles.date_container}>
                <h2 className={styles.section_heading}>DATE INTERVAL</h2>
                <div className={styles.input_container}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="From"
                            value={dateValue1}
                            onChange={(newValue) => {
                                setdateValue1(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} sx={{width: '150px', fontSize:'10px'}}/>}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="To"
                            value={dateValue2}
                            onChange={(newValue) => {
                                setdateValue2(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} sx={{width: '150px', fontSize:'10px'}}/>}
                        />
                    </LocalizationProvider>
                </div>
            </div>
            <div className={styles.buttons}>
                <Button variant='contained' className={styles.confirmBtn}>Save</Button>
                <IconButton aria-label="delete" onClick={() => {setdateValue2(null); setdateValue1(null); setQuery(""); }}>
                    <DeleteIcon />
                </IconButton>
            </div>
        </div>
    );
}

export default Filter;