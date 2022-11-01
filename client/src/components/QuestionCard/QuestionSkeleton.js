import React from "react";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

import styles from './QuestionCard.module.scss';

const QuestionSkeleton = () => {
    return(
        <div className={styles.skeleton}>
             <Stack spacing={1}>
                <Skeleton variant="rectangular" className={styles.container}/>
                <div className={styles.skeletonContent}>
                    <div className={styles.heading}>
                        <Skeleton variant="text" className={styles.title} width={800} height={40} />
                        <div className={styles.user}>
                            <Skeleton variant="circular" className={styles.avatar} width={40} height={40} />
                            <Skeleton variant="text" className={styles.username} width={100} height={30} />
                        </div>
                    </div>
                    <Skeleton variant="text" className={styles.text} width={1000} height={30} sx={{ marginTop: '10px' }}/>
                    <Skeleton variant="text" className={styles.text} width={1000} height={30} />
                </div>
             </Stack>
        </div>
    );
}

export default QuestionSkeleton;