import React, { useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import styles from '../styles/Footer.module.css';
import { RiInstagramLine, RiPinterestLine, RiLinkedinBoxLine, RiGlobeLine } from 'react-icons/ri';

const Footer = () => {
    const { currentLang } = useContext(ProjectContext);

    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footerSection}>
            <div className={styles.container}>

                <div className={styles.topBar}>
                    <div className={styles.logoArea}>
                        <h2>CADANCE <span>FLOW</span></h2>
                        <p>{currentLang.footer.footerDescp}</p>
                    </div>

                    <div className={styles.socialLinks}>
                        <a href="https:/instagram.com/cadancestudio/" target="_blank" rel="noreferrer" aria-label="Instagram">
                            <RiInstagramLine />
                        </a>
                        <a href="https://pinterest.com/cadancestudio" target="_blank" rel="noreferrer" aria-label="Instagram">
                            <RiPinterestLine />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                            <RiLinkedinBoxLine />
                        </a>
                        <a href="https://www.cadancestudio.com" target="_blank" rel="noreferrer" aria-label="Website">
                            <RiGlobeLine />
                        </a>
                    </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.bottomBar}>
                    <p className={styles.copyright}>
                        © {currentYear} Cadance Studio. {currentLang.footer.copyrightText}
                    </p>

                    <div className={styles.footerNav}>
                        <a href="https://www.cadancestudio.com" target="_blank" rel="noreferrer">Stüdyo</a>
                        <a href="/destek">Destek</a>
                        <a href="/login">Giriş Yap</a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;