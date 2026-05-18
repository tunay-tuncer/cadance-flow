import React, { useContext } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import styles from '../../styles/Gallery.module.css';
import logo from "../../assets/LogoPNG.png";

const Gallery = () => {
    const { currentLang } = useContext(ProjectContext);

    const galleryItems = [
        {
            id: 1,
            title: currentLang.gallery.galleryItems.title1,
            type: currentLang.gallery.galleryItems.type1,
            image: "https://res.cloudinary.com/dabmjz0xr/image/upload/v1778014421/Interior2PP_fvytj3.png",
            size: "large" // CSS'te büyük yer kaplayacak
        },
        {
            id: 2,
            title: currentLang.gallery.galleryItems.title2,
            type: currentLang.gallery.galleryItems.type2,
            image: "https://res.cloudinary.com/dabmjz0xr/image/upload/v1778014465/G%C3%B6rsel_05_yhcmbq.jpg",
            size: "large" // Dikeyde uzun olacak
        },
        {
            id: 3,
            title: currentLang.gallery.galleryItems.title3,
            type: currentLang.gallery.galleryItems.type3,
            image: "https://res.cloudinary.com/dabmjz0xr/image/upload/v1778014379/F1_Final_kvam4p.png",
            size: "wide" // Yatayda geniş olacak
        },
        {
            id: 4,
            title: currentLang.gallery.galleryItems.title4,
            type: currentLang.gallery.galleryItems.type4,
            image: "https://res.cloudinary.com/dabmjz0xr/image/upload/v1778014405/Sahne1_v3z0ik.png",
            size: "small" // Standart kare
        }
    ];

    return (
        <section className={styles.gallerySection}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <p className={styles.subTitle}>PORTFOLYO</p>
                    <h2 className={styles.mainTitle}>
                        Seçkin Projeler <span>Galerisi</span>
                    </h2>
                </div>

                <div className={styles.bentoGrid}>
                    {galleryItems.map((item) => (
                        <div
                            key={item.id}
                            className={`${styles.galleryCard} ${styles[item.size]}`}
                        >
                            <div className={styles.imageWrapper}>
                                <img src={item.image} alt={item.title} />
                                <div className={styles.overlay}>
                                    <div className={styles.info}>
                                        <h3>{item.title}</h3>
                                        <p>{item.type}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <a
                        href="https://www.cadancestudio.com"
                        target="_blank"
                        rel="noreferrer"
                        className={`${styles.galleryCard} ${styles.small}`}
                    >
                        <div className={styles.redirectContent}>
                            <img src={logo} />
                            <h3>{currentLang.gallery.redirectCard}</h3>
                            <p>cadancestudio.com</p>
                        </div>
                    </a>
                </div>

            </div>
        </section>
    );
};

export default Gallery;