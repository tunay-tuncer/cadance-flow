import React, { useContext, useRef, useEffect, useState } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import styles from '../../styles/Reviews.module.css';
import { RiUserLine } from 'react-icons/ri';
import { supabase } from '../../config/supabaseClient';

const Reviews = () => {
    const { currentLang } = useContext(ProjectContext);
    const trackRef = useRef(null);
    const [cloneCount, setCloneCount] = useState(4);

    const [reviewItems, setReviewItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const measureAndSet = () => {
        if (!trackRef.current) return;

        const cards = trackRef.current.querySelectorAll('[data-group="0"]');
        if (cards.length === 0) return;

        let groupWidth = 0;
        cards.forEach((card) => {
            const marginRight = parseFloat(window.getComputedStyle(card).marginRight) || 0;
            groupWidth += card.offsetWidth + marginRight;
        });

        if (groupWidth === 0) return;

        const needed = Math.ceil((window.innerWidth * 2.5) / groupWidth);
        setCloneCount(Math.max(needed, 3));

        trackRef.current.style.setProperty('--marquee-shift', `-${groupWidth}px`);
    };

    // İlk mount
    useEffect(() => {
        const timer = setTimeout(measureAndSet, 60);
        window.addEventListener('resize', measureAndSet);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', measureAndSet);
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(measureAndSet, 60);
        return () => clearTimeout(timer);
    }, [cloneCount]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true)
                const { data, error } = await supabase
                    .from('user_reviews')
                    .select('*')
                if (error) throw error;
                if (data) {
                    console.log(data)
                    setReviewItems(data);
                }
            }
            catch (error) {
                console.error('Yorumlar çekilirken bir hata oluştu:', error.message);
            }
            finally {
                setLoading(false)
            }
        }

        fetchReviews();

    }, [])

    if (loading) {
        return (
            <section className={styles.reviewsSection}>
                <div className={styles.container} style={{ textAlign: 'center', color: 'var(--lightGray)' }}>
                    <p>Loading Reviews...</p>
                </div>
            </section>
        );
    }

    if (reviewItems.length === 0) return null;

    const renderGroup = (groupIndex) =>
        reviewItems.map((item) => (
            <div
                key={`g${groupIndex}-${item.id}`}
                className={styles.reviewCard}
                data-group={String(groupIndex)}
            >
                <p className={styles.commentText}>"{item.review}"</p>
                <div className={styles.userInfo}>
                    <div className={styles.avatarWrapper}>
                        <RiUserLine className={styles.defaultAvatar} />
                    </div>
                    <div className={styles.userMeta}>
                        <h3>{item.user_name}</h3>
                        <p>{item.role}</p>
                    </div>
                </div>
            </div>
        ));

    return (
        <section className={styles.reviewsSection}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <p className={styles.subTitle}>{currentLang.reviews.reviewSubTitle}</p>
                    <h2 className={styles.mainTitle}>
                        {currentLang.reviews.reviewMainTitle} <span>{currentLang.reviews.reviewMainTitleSpan}</span>
                    </h2>
                </div>
            </div>

            <div className={styles.marqueeContainer}>
                <div className={styles.marqueeTrack} ref={trackRef}>
                    {Array.from({ length: cloneCount }, (_, i) => renderGroup(i))}
                </div>
            </div>
        </section>
    );
};

export default Reviews;