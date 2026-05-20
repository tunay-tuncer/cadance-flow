import { useContext } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
//STYLES
import styles from '../../styles/CallToAction.module.css';
//REACT ICONS
import { MdOutlineArrowForward, MdOutlineChat } from 'react-icons/md';

const CallToAction = () => {
    const { currentLang } = useContext(ProjectContext);

    const WHATSAPP_NUMBER = "905076633152";

    return (
        <section className={styles.ctaSection}>
            <div className={styles.container}>
                <div className={styles.ctaCard}>

                    <div className={styles.glowBg} />

                    <div className={styles.content}>
                        <p className={styles.subHeading}>{currentLang.cta.ctaSubTitle}</p>
                        <h2 className={styles.mainHeading}>
                            {currentLang.cta.ctaMainTitle} <span>{currentLang.cta.ctaMainTitleSpan}</span>
                        </h2>
                        <p className={styles.description}>
                            {currentLang.cta.ctaParagraph}
                        </p>

                        <div className={styles.buttonGroup}>

                            <a href="/login" className={styles.primaryBtn}>
                                {currentLang.cta.flowButton} <MdOutlineArrowForward />
                            </a>

                            <a
                                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Merhaba,%20yeni%20bir%20mimari%20proje%20için%20teklif%20almak%20istiyorum.`}
                                target="_blank"
                                rel="noreferrer"
                                className={styles.secondaryBtn}
                            >
                                <MdOutlineChat /> {currentLang.cta.offerButton}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;