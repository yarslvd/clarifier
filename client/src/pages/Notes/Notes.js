import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {v4 as uuid} from 'uuid'

import {  Container, Button } from '@mui/material';

import styles from './Notes.module.scss';
import { selectIsAuth } from '../../redux/slices/authSlice';

const Notes = () => {
    const navigate = useNavigate();
    const auth = useSelector(selectIsAuth);
    const [toDoList, setToDoList] = useState([]);
    const [noteText, setNoteText] = useState();

    const saveNotes = (text) => {
        console.log(text);
        setNoteText(text);
        localStorage.setItem('notes', text);
    }

    useEffect(() => {
        if(!auth) {
            navigate('/login');
        }
    }, []);

    useEffect(() => {
        setNoteText(localStorage.getItem('notes'));
    }, [noteText])

    console.log(noteText);

    useEffect(() => {
        if(JSON.parse(localStorage.getItem("todos"))) {
            let ls = JSON.parse(localStorage.getItem("todos"));
            console.log(ls);
            setToDoList(ls);
        }
    }, [])

    const handleToggle = (id) => {
        let mapped = toDoList.map(task => {
            if(task.id === Number(id)) {
                console.log({ ...task, complete: !task.complete });
                let ls = JSON.parse(localStorage.getItem('todos'));
                ls[task.id - 1].complete = !task.complete;
                
                localStorage.setItem('todos', JSON.stringify(ls))
            }
            return task.id === Number(id) ? { ...task, complete: !task.complete } : { ...task};
        });
        setToDoList(mapped);
    }

    const handleFilter = () => {
        let filtered = toDoList.filter(task => {
            return !task.complete;
        });
        let ls = JSON.parse(localStorage.getItem('todos'));
        ls = ls.filter(task => {
            return !task.complete;
        });
        localStorage.setItem('todos', JSON.stringify(ls))

        setToDoList(filtered);
    }

    const addTask = (userInput) => {
        let copy;
        if(JSON.parse(localStorage.getItem('todos'))) {
            copy = [...JSON.parse(localStorage.getItem('todos'))];
        }
        else {
            copy = [...toDoList];
        }
        copy = [...copy, { id: toDoList.length + 1, task: userInput, complete: false }];
        setToDoList(copy);
        if(JSON.parse(localStorage.getItem('todos'))) {
            localStorage.setItem('todos', JSON.stringify(copy));
        }
        else {
            localStorage.setItem('todos', JSON.stringify(copy));
        }
    }
    const [ userInput, setUserInput ] = useState('');

    const handleChange = (e) => {
        setUserInput(e.currentTarget.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        addTask(userInput);
        setUserInput("");
    }

    return (
        <main>
            <Container sx={{display: 'grid', gridTemplateColumns: '3fr 1fr', marginTop: '100px', marginBottom: '100px', gap: '50px'}}>
                <div className={styles.notes}>
                    <h2>Notes:</h2>
                    <textarea onChange={(e) => saveNotes(e.target.value)}>{localStorage.getItem('notes')}</textarea>
                </div>
                <div className={styles.todoContainer}>
                    <h2>To Do:</h2>
                    <div className={styles.container}>
                        {toDoList.map(todo => {
                            return (
                                <ToDo todo={todo} handleToggle={handleToggle} handleFilter={handleFilter}/>
                            )
                        })}
                    </div>
                    <form onSubmit={handleSubmit}>
                        <input value={userInput} type="text" onChange={handleChange} placeholder="Enter task..."/>
                        <Button variant='contained' type='submit'>Submit</Button>
                    </form>
                    <Button onClick={handleFilter} className={styles.todoBtn}>Clear Completed</Button>
                </div>
            </Container>
        </main>
    );
}

const ToDo = ({todo, handleToggle}) => {

    const handleClick = (e) => {
        e.preventDefault()
        handleToggle(e.currentTarget.id)
    }

    return (
        <div id={todo.id} key={todo.id + todo.task} name="todo" value={todo.id} onClick={handleClick} className={todo.complete ? styles.strike : styles.todo}>
            {todo.task}
        </div>
    );
};

export default Notes;