import React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import styles from './ConfirmEmail.module.scss';
import background from '../../assets/images/ConfirmEmailBG.png';
import illustration from '../../assets/images/ConfirmEmail_illustration.png';
import illustrationError from '../../assets/images/ConfirmEmail_illustrationError.png';

import { fetchConfirmEmail } from '../../redux/slices/authSlice';

const ConfirmEmail = () => {
    const dispatch = useDispatch();

    const { userInfo, error } = useSelector((state) => state.auth);
    const { token } = useParams();

    React.useEffect(() => {
        dispatch(fetchConfirmEmail(token));
    }, []);

    return (
        <main>
            <section>
                <div className={styles.content_box}>
                    {error && <><img src={illustrationError} alt='Illustration'/><p>{error}</p></>}
                    {userInfo && <><img src={illustration} alt='Illustration'/><p>{userInfo}</p></>}
                </div>
                <div className={styles.image_box}>
                    <div className={styles.text}>
                        <h2>clarifier.</h2>
                        <span>A place to share knowledge and<br/>better understand the world</span>
                    </div>
                    <img src={background} alt=''/>
                </div>
            </section>
        </main>
    );
}

export default ConfirmEmail;