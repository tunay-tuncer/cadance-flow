import React, { useState } from 'react';
import styles from '../../styles/FlowSupport.module.css';
import { MdWhatsapp, MdMailOutline, MdHelpOutline, MdCheckCircle, MdExpandMore } from 'react-icons/md';

const Support = () => {
    const WHATSAPP_NUMBER = "905532665804";
    const SUPPORT_EMAIL = "info@cadancestudio.com";

    // Hangi sorunun açık olduğunu tutan state (null = hepsi kapalı)
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqItems = [
        {
            q: "Revizyon taleplerimi nasıl iletebilirim?",
            a: "Proje sayfasındaki yorum alanını kullanarak görsel üzerine notlar bırakabilir veya acil durumlar için WhatsApp üzerinden doğrudan mimarınızla iletişime geçebilirsiniz."
        },
        {
            q: "Final dosyalarını hangi formatta alacağım?",
            a: "Görsel teslimatlarımız 4K çözünürlükte JPEG/PNG, teknik çizimlerimiz ise talebinize göre vektörel PDF veya katmanlı DWG (AutoCAD) formatında sunulmaktadır."
        },
        {
            q: "Ödeme ve faturalandırma süreci nasıl işliyor?",
            a: "Sistem üzerinden kredi kartı veya havale ile ödeme yapabilirsiniz. Ödeme onayının ardından faturanız kayıtlı e-posta adresinize otomatik olarak gönderilir."
        },
        {
            q: "Dosyalarım sistemde ne kadar süre saklanıyor?",
            a: "Projeleriniz tamamlandıktan sonra 12 ay boyunca 'Arşiv' bölümünde güvenle saklanır. Bu süre zarfında dilediğiniz zaman erişip tekrar indirebilirsiniz."
        },
        {
            q: "Özel bir tasarım veya danışmanlık talep edebilir miyim?",
            a: "Evet, standart paketlerimizin dışındaki özel talepleriniz için WhatsApp butonu üzerinden bize ulaşarak size özel bir iş akışı ve fiyatlandırma talep edebilirsiniz."
        }
    ];

    return (
        <div className={styles.supportContainer}>
            <header className={styles.supportHeader}>
                <h1>DESTEK MERKEZİ</h1>
                <p>Bir sorunuz mu var? Size yardımcı olmak için buradayız.</p>
            </header>

            <section className={styles.statusBanner}>
                <MdCheckCircle />
                <span>Tüm sistemler aktif: Render sunucuları ve servisler sorunsuz çalışıyor.</span>
            </section>

            <div className={styles.contactGrid}>
                <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=Merhaba%20Tunay,%20Cadance%20Flow%20üzerinden%20ulaşıyorum.`}
                    target="_blank" rel="noreferrer" className={styles.contactCard}
                >
                    <div className={styles.iconBox} style={{ background: '#25D366' }}><MdWhatsapp /></div>
                    <h2>WhatsApp ile Sorun</h2>
                    <p>Hızlı ve anlık çözümler için mimarınıza doğrudan mesaj gönderin.</p>
                    <span className={styles.actionText}>Mesaj Gönder →</span>
                </a>

                <a href={`mailto:${SUPPORT_EMAIL}`} className={styles.contactCard}>
                    <div className={styles.iconBox} style={{ background: 'var(--accent)' }}><MdMailOutline /></div>
                    <h2>E-posta Gönderin</h2>
                    <p>Resmi talepler, kurumsal iş birlikleri ve dosya işlemleri için bize yazın.</p>
                    <span className={styles.actionText}>E-posta Yaz →</span>
                </a>
            </div>

            <section className={styles.faqSection}>
                <div className={styles.sectionTitle}>
                    <MdHelpOutline className={styles.sectionIcon} />
                    <h2>Sıkça Sorulan Sorular</h2>
                </div>

                <div className={styles.accordionContainer}>
                    {faqItems.map((item, index) => (
                        <div
                            key={index}
                            className={`${styles.accordionItem} ${activeIndex === index ? styles.active : ''}`}
                        >
                            <button
                                className={styles.accordionHeader}
                                onClick={() => toggleAccordion(index)}
                            >
                                <span>{item.q}</span>
                                <MdExpandMore className={styles.arrowIcon} />
                            </button>
                            <div className={styles.accordionContent}>
                                <p>{item.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Support;