import React, { useContext } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import styles from '../../styles/Process.module.css';
import { MdOutlineQrCodeScanner, MdOutlineRateReview, MdOutlineCloudDownload } from 'react-icons/md';

const Process = () => {
    const { currentLang } = useContext(ProjectContext);

    // Dil dosyasından çekmek istersen burayı güncelleyebilirsin, şimdilik statik/dinamik kurgu:
    const steps = [
        {
            icon: <MdOutlineQrCodeScanner />,
            number: "01",
            title: currentLang.process.steps.stepTitle1,
            desc: currentLang.process.steps.stepDesc1,
        },
        {
            icon: <MdOutlineRateReview />,
            number: "02",
            title: currentLang.process.steps.stepTitle2,
            desc: currentLang.process.steps.stepDesc2,
        },
        {
            icon: <MdOutlineCloudDownload />,
            number: "03",
            title: currentLang.process.steps.stepTitle3,
            desc: currentLang.process.steps.stepDesc3,
        }
    ];

    return (
        <section className={styles.processSection}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <p className={styles.subTitle}>{currentLang.process.processSubTitle}</p>
                    <h2 className={styles.mainTitle}>
                        {currentLang.process.processMainTitle} <span>{currentLang.process.processMainTitleSpan}</span>
                    </h2>
                </div>

                <div className={styles.grid}>
                    {steps.map((step, index) => (
                        <div key={index} className={styles.stepCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.iconWrapper}>
                                    {step.icon}
                                </div>
                                <span className={styles.stepNumber}>{step.number}</span>
                            </div>
                            <div className={styles.cardContent}>
                                <h3>{step.title}</h3>
                                <p>{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Process;