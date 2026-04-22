import { useState, useEffect } from "react";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import styles from "../../styles/Project.module.css"

const FsImageContainer = ({ image, isFsOpen, setIsFsOpen }) => {

    const closeFullscreen = () => {
        setIsFsOpen(false);
        document.body.style.overflow = 'auto';
    }

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') closeFullscreen();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);


    return (
        <div className={styles.fullscreenContainer}>
            <MdFullscreenExit className={styles.fullscreenIcon} onClick={closeFullscreen} />
            <img src={image.url} alt="" />
        </div>
    )
}

export default FsImageContainer