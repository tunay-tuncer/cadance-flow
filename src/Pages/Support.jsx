import React, { useState, useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import { PageHelmet } from '../hooks/usePageHelmet.jsx';
import { metaTags } from '../config/metaTags';
//COMPONENTS
import Navbar from '../components/HomePageComponents/Navbar';
import Footer from '../components/Footer';
import GridBackground from '../components/GridBackground';
//STYLES
import styles from '../styles/Support.module.css';
//REACT ICONS
import { MdOutlineHelpOutline, MdWhatsapp, MdOutlineMail, MdOutlineLocationOn, MdExpandMore } from 'react-icons/md';

const MainSupport = () => {
    const { currentLang, langCode } = useContext(ProjectContext);
    const [activeIndex, setActiveIndex] = useState(null);

    const WHATSAPP_NUMBER = "905532665804";
    const SUPPORT_EMAIL = "info@cadancestudio.com";

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqItems = [
        { q: currentLang.support.faqContainer.q1, a: currentLang.support.faqContainer.a1 },
        { q: currentLang.support.faqContainer.q2, a: currentLang.support.faqContainer.a2 },
        { q: currentLang.support.faqContainer.q3, a: currentLang.support.faqContainer.a3 },
        { q: currentLang.support.faqContainer.q4, a: currentLang.support.faqContainer.a4 },
        { q: currentLang.support.faqContainer.q5, a: currentLang.support.faqContainer.a5 },
        { q: currentLang.support.faqContainer.q6, a: currentLang.support.faqContainer.a6 },
        { q: currentLang.support.faqContainer.q7, a: currentLang.support.faqContainer.a7 }
    ]

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Mesajınız başarıyla iletildi. En kısa sürede geri dönüş sağlayacağız.");
    };

    return (
        <>
            <PageHelmet metaData={metaTags.support} language={langCode} />
            <GridBackground />
            <Navbar />

            <div className={styles.supportPage}>
                <header className={styles.pageHeader}>
                    <p className={styles.subTitle}>{currentLang.support.supportSubTitle}</p>
                    <h1 className={styles.mainTitle}>
                        {currentLang.support.supportMainTitle} <span>{currentLang.support.supportMainTitleSpan}</span>
                    </h1>
                </header>
                <div className={styles.mainGrid}>
                    {/* Sol Kolon: Form ve İletişim Bilgileri */}
                    <div className={styles.leftColumn}>
                        <form className={styles.contactForm} onSubmit={handleSubmit}>
                            <h3>{currentLang.support.inputContainer.heading}</h3>
                            <div className={styles.inputGroup}>
                                <input type="text" placeholder={currentLang.support.inputContainer.name} required />
                            </div>
                            <div className={styles.inputGroup}>
                                <input type="email" placeholder={currentLang.support.inputContainer.email} required />
                            </div>
                            <div className={styles.inputGroup}>
                                <textarea placeholder={currentLang.support.inputContainer.textArea} rows="5" required></textarea>
                            </div>
                            <button type="submit" className={styles.submitBtn}>{currentLang.support.inputContainer.sendButton}</button>
                        </form>
                        <div className={styles.infoCard}>
                            <a href={`mailto:${SUPPORT_EMAIL}`} className={styles.infoItem}>
                                <MdOutlineMail />
                                <div>
                                    <h4>{currentLang.support.emailText}</h4>
                                    <p>info@cadancestudio.com</p>
                                </div>
                            </a>
                            <a className={styles.infoItem} href={`https://wa.me/${WHATSAPP_NUMBER}?text=Merhaba,%20Cadance%20Flow%20üzerinden%20ulaşıyorum.`}
                                target="_blank" rel="noreferrer">
                                <MdWhatsapp style={{ color: "#25D366" }} />
                                <div>
                                    <h4>Whats App</h4>
                                    <p>+90 553 266 58 04</p>
                                </div>
                            </a>
                            <div className={styles.infoItem}>
                                <MdOutlineLocationOn />
                                <div>
                                    <h4>{currentLang.support.studioText}</h4>
                                    <p>İzmir, Türkiye</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Sağ Kolon: SSS Accordion */}
                    <div className={styles.rightColumn}>
                        <div className={styles.sectionTitle}>
                            <MdOutlineHelpOutline />
                            <h2>Sıkça Sorulan Sorular</h2>
                        </div>
                        <div className={styles.accordionContainer}>
                            {faqItems.map((item, index) => (
                                <div
                                    key={index}
                                    className={`${styles.accordionItem} ${activeIndex === index ? styles.active : ''}`}
                                >
                                    <button className={styles.accordionHeader} onClick={() => toggleAccordion(index)}>
                                        <span>{item.q}</span>
                                        <MdExpandMore className={styles.arrowIcon} />
                                    </button>
                                    <div className={styles.accordionContent}>
                                        <p>{item.a}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MainSupport;