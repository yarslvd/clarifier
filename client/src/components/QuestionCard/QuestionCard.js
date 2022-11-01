import React from 'react';
import { useDispatch } from 'react-redux';

import { Avatar, Link, IconButton } from '@mui/material';

import styles from './QuestionCard.module.scss';
import QuestionSkeleton from './QuestionSkeleton';

import GradeIcon from '@mui/icons-material/Grade';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { fetchRemovePost } from '../../redux/slices/posts';

const QuestionCard = ({ id, title, content, date, username, avatar, rating, isLoading, link, isEditable }) => {
    const dispatch = useDispatch();

    if(isLoading) {
        console.log('efef');
        return <QuestionSkeleton/>
    }

    const onClickRemove = () => {
        if(window.confirm('Confirm deleting of the question')) {
            console.log(id);
            dispatch(fetchRemovePost(id));
            window.location.reload();
        }
    };

    return (
        <div className={styles.cardContainer}>
            {isEditable && (
                <div className={styles.editButtons}>
                    <a /*href={`/questions/${id}/edit`}*/>
                        <IconButton color="primary">
                            <EditIcon />
                        </IconButton>
                    </a>
                    <IconButton onClick={onClickRemove} color="secondary">
                        <DeleteIcon />
                    </IconButton>
                </div>
            )}
            <div className={styles.heading}>
                <Link href={`/questions/${id}`}><h3>{title}</h3></Link>
                <div className={styles.user}>
                    <Avatar src={`http://localhost:8000/${avatar}`} alt={username} />
                    <Link href={`/users/${link}`}>{username}</Link>
                </div>
            </div>
            <p className={styles.text}>
                {content}
            </p>
            <div className={styles.cardBottom}>
                <span>{date}</span>
                <div className={styles.rating}>
                    <div className={styles.item}><GradeIcon></GradeIcon>{rating}</div>
                </div>
            </div>
        </div>
    );
}

export default QuestionCard;