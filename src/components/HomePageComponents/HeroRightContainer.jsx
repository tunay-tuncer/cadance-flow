//DEPENDENCIES
import { useEffect, useState, useRef, useContext } from "react";
import { ProjectContext } from "../../context/ProjectContext";

//STYLES
import styles from "../../styles/Hero.module.css";

//REACT ICONS
import { HiMiniPencilSquare } from "react-icons/hi2";
import { LuFileInput } from "react-icons/lu";
import { FaRegNoteSticky } from "react-icons/fa6";
import { TbHexagon3D } from "react-icons/tb";
import { TbTexture } from "react-icons/tb";
import { LuClapperboard } from "react-icons/lu";
import { IoCameraOutline } from "react-icons/io5";
import { BsSendArrowUp } from "react-icons/bs";
import { TbExclamationCircle } from "react-icons/tb";

const HeroRightContainer = () => {
    const { currentLang } = useContext(ProjectContext);
    const textPath = currentLang.hero.rightContainerText;

    const [currentStep, setCurrentStep] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [degree, setDegree] = useState(0);
    const [animKey, setAnimKey] = useState(0);
    const [isIncrementing, setIsIncrementing] = useState(false);

    const allSteps = [
        { stepName: textPath.clientInputText, approvalName: textPath.clientInputApproval, percentageVal: 0, icon: <LuFileInput /> },
        { stepName: textPath.strategyAndMoodText, approvalName: textPath.strategyAndMoodApproval, percentageVal: 15, icon: <FaRegNoteSticky /> },
        { stepName: textPath.drawingText, approvalName: textPath.drawingApproval, percentageVal: 10, icon: <HiMiniPencilSquare /> },
        { stepName: textPath.modellingText, approvalName: textPath.modellingApproval, percentageVal: 20, icon: <TbHexagon3D /> },
        { stepName: textPath.texturingAndLightingText, approvalName: textPath.texturingAndLightingApproval, percentageVal: 15, icon: <TbTexture /> },
        { stepName: textPath.renderingText, approvalName: textPath.renderingApproval, percentageVal: 15, icon: <LuClapperboard /> },
        { stepName: textPath.postProductionText, approvalName: textPath.postProductionApproval, percentageVal: 15, icon: <IoCameraOutline /> },
        { stepName: textPath.submitionText, approvalName: textPath.submitionApproval, percentageVal: 10, icon: <BsSendArrowUp /> },
    ];

    // Hedef yüzdelikleri önceden hesapla: [0, 15, 25, 45, 60, 75, 90, 100]
    const targets = allSteps.map((_, i) =>
        allSteps.slice(0, i + 1).reduce((sum, step) => sum + step.percentageVal, 0)
    );

    const targetsRef = useRef(targets);
    useEffect(() => {
        targetsRef.current = targets;
    }, [targets]);

    useEffect(() => {
        let animationFrame;
        let timeout;
        let isMounted = true;

        let stepIndex = 0;
        let currentPct = 0;

        const runCycle = () => {
            if (!isMounted) return;

            const nextStepIndex = stepIndex === targetsRef.current.length - 1 ? 0 : stepIndex + 1;
            const targetPct = nextStepIndex === 0 ? 0 : targetsRef.current[nextStepIndex];

            // Animasyon başladığı an isIncrementing'i tetikle (Fontu küçültür)
            setIsIncrementing(true);

            const duration = nextStepIndex === 0 ? 800 : 2000; // Resetleme 0.8s, normal artış 2s sürer
            const startTime = performance.now();
            const startPct = currentPct;

            const animate = (time) => {
                const elapsed = time - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // İpeksi Geçiş (Cubic Ease Out): Sona doğru yumuşayarak durur
                const easeProgress = nextStepIndex === 0
                    ? progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2
                    : 1 - Math.pow(1 - progress, 3);

                const currentVal = startPct + (targetPct - startPct) * easeProgress;
                currentPct = currentVal;

                // Değerleri milisaniyelik güncelliyoruz
                setPercentage(Math.round(currentVal));
                setDegree(360 * (currentVal / 100));

                if (progress < 1) {
                    animationFrame = requestAnimationFrame(animate);
                } else {
                    // --- ANİMASYON HEDEFE ULAŞTIĞINDA ---
                    setIsIncrementing(false); // Font anında büyümeye başlar
                    stepIndex = nextStepIndex;
                    setCurrentStep(stepIndex);
                    setAnimKey(k => k + 1); // Border ve İkon animasyonunu baştan tetikler

                    // Bir sonraki aşamaya geçmeden önce bekletme süresi
                    let pauseTime = 1500; // Standart bekleme: 1.5 Saniye
                    if (targetPct >= 100) {
                        pauseTime = 3000; // %100 olduğunda kullanıcı algılasın diye 3 saniye bekle
                    } else if (targetPct === 0) {
                        pauseTime = 500; // Reset atıldıktan sonra hemen 1. adıma geç
                    }

                    timeout = setTimeout(runCycle, pauseTime);
                }
            };
            animationFrame = requestAnimationFrame(animate);
        };


        timeout = setTimeout(runCycle, 1500);

        return () => {
            isMounted = false;
            cancelAnimationFrame(animationFrame);
            clearTimeout(timeout);
        };
    }, []);

    const nextStep = currentStep < allSteps.length - 1 ? currentStep + 1 : 0;

    return (
        <div className={styles.rightContainer}>
            <h1>{textPath.projectDashboardText}</h1>

            <div className={styles.contentContainer}>
                <div className={styles.progressBar}>

                    <div
                        className={styles.outerDiv}
                        style={{ '--degree': `${degree}deg`, transition: 'none' }}
                    ></div>
                    <div className={styles.innerDiv}></div>
                    <div className={styles.progressTextContainer}>
                        <p className={`${styles.percentageText} ${isIncrementing ? styles.incrementing : ''}`}>
                            {`${percentage}%`}
                        </p>
                        <span style={{ color: percentage === 100 ? 'var(--accent)' : 'inherit', transition: 'color 0.3s' }}>
                            {percentage === 100 ? `${textPath.completeText}!` : textPath.completeText}
                        </span>
                    </div>
                </div>

                <div className={styles.stepsContainer}>
                    <div className={styles.phaseContainer} key={`current-${animKey}`}>
                        <div className={styles.svgContainer} key={`svg-current-${animKey}`}>
                            {allSteps[currentStep].icon}
                        </div>
                        <div className={styles.phaseTextContainer}>
                            <p>{textPath.projectPhaseText}</p>
                            <h3>{allSteps[currentStep].stepName}</h3>
                        </div>
                    </div>

                    <div className={styles.phaseContainer}>
                        <div className={styles.svgContainer}>
                            {allSteps[nextStep].icon}
                        </div>
                        <div className={styles.phaseTextContainer}>
                            <p>{textPath.nextStepText}</p>
                            <h3>{allSteps[nextStep].stepName}</h3>
                        </div>
                    </div>

                    <div className={styles.phaseContainer}>
                        <div className={styles.svgContainer} >
                            <TbExclamationCircle />
                        </div>
                        <div className={styles.phaseTextContainer}>
                            <p>{textPath.approvalText}:</p>
                            <h3>{allSteps[currentStep].approvalName}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroRightContainer;