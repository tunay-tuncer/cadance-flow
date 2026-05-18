import React, { useContext } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import styles from '../../styles/Reviews.module.css';
import { RiUserLine } from 'react-icons/ri';

const Reviews = () => {
    const { currentLang } = useContext(ProjectContext);

    // Gerçekçi müşteri geri bildirim senaryoları
    const reviewItems = [
        {
            id: 1,
            name: "Merve Yılmaz",
            role: "Yüksek Mimar / Aura Studio",
            avatar: null, // Varsa görsel import edilebilir
            comment: "Cadance Flow sayesinde WhatsApp gruplarında revizyon aramaktan kurtulduk. Görsellerin üzerine doğrudan not bırakabilmek iş akışımızı inanılmaz hızlandırdı."
        },
        {
            id: 2,
            name: "Can Tekin",
            role: "Gayrimenkul Geliştirici",
            avatar: null,
            comment: "Proje takip numarasıyla her an render sürecini izleyebilmek büyük bir şeffaflık sağlıyor. Ne zaman teslim alacağımı bilerek hareket ediyorum. Harika bir sistem."
        },
        {
            id: 3,
            name: "Selin Demir",
            role: "İç Mimar",
            avatar: null,
            comment: "Geleneksel render ofisleriyle çalışırken yaşanan o iletişim kopukluğu Cadance ile tamamen çözülmüş. Platformun hızı ve teslimat kalitesi tek kelimeyle kusursuz."
        }
    ];

    return (
        <section className={styles.reviewsSection}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <p className={styles.subTitle}>KULLANICI DENEYİMLERİ</p>
                    <h2 className={styles.mainTitle}>
                        Onların Gözünden <span>Cadance</span>
                    </h2>
                </div>

                <div className={styles.reviewsGrid}>
                    {reviewItems.map((item) => (
                        <div key={item.id} className={styles.reviewCard}>
                            <p className={styles.commentText}>“{item.comment}”</p>

                            <div className={styles.userInfo}>
                                <div className={styles.avatarWrapper}>
                                    {item.avatar ? (
                                        <img src={item.avatar} alt={item.name} />
                                    ) : (
                                        <RiUserLine className={styles.defaultAvatar} />
                                    )}
                                </div>
                                <div className={styles.userMeta}>
                                    <h3>{item.name}</h3>
                                    <p>{item.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Reviews;