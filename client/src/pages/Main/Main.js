import React from 'react';
import { Box, Container, Button, Link } from '@mui/material'

import { styled } from '@mui/material/styles';
import Gradient from '../../assets/images/Gradient.png';
import Illustarion from '../../assets/images/main_page_illustration.png';
import styles from './Main.module.scss';

const Image = styled('img')(({ theme }) => ({
    position: 'absolute',
    zIndex: '-10',
    top: '60px',
    right: 0,
    width: '70%',
    [theme.breakpoints.down('md')]: {
        width: '60%'
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        top: '25%'
    }
}));

const Main = () => {
    return (
        <main>
            <Container maxWidth='xl'>
                <section style={{ position: 'relative' }} className={styles.section1}>
                    <Box className={styles.text_container}>
                        <h1 className={styles.join}>JOIN</h1>
                        <h1 className={styles.main_text}> THE COMMUNITY</h1>
                        <span className={styles.description}>Find the best answer to your<br/> technical question</span>
                        <Box className={styles.buttons_box}>
                            <Button href='/signup' variant="contained" className={styles.signup_btn}>Sign Up</Button>
                            <Button href='/login' variant="text" className={styles.login_btn}>Log In</Button>
                        </Box>
                    </Box>
                </section>
                <Image src={Gradient} alt='background'/>

                <section style={{ position: 'relative' }} className={styles.section2}>
                    <img src={Illustarion} alt='background illustrtation'className={styles.Illustarion}/>
                    <Box className={styles.text_container}>
                        <h1 className={styles.heading}>who are we?</h1>
                        <span className={styles.description}>A public platform building the<br/>definitive collection of coding<br/>questions & answers</span>
                        <Link href="/questions" className={styles.link}>search content</Link>
                    </Box>
                </section>
            </Container>
        </main>
    );
}

export default Main;