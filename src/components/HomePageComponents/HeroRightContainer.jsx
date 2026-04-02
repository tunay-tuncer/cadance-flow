import styles from "../../styles/Hero.module.css";
import { useEffect, useState, useRef, useContext } from "react";
import { ProjectContext } from "../../context/ProjectContext";

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

const PAUSE_AT_100_MS = 2000; // how long to hold at 100% before resetting
const INTERVAL_MS = 3000;



const HeroRightContainer = () => {
    const { currentLang } = useContext(ProjectContext);

    const [currentStep, setCurrentStep] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [degree, setDegree] = useState(0);
    const [animKey, setAnimKey] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const currentStepRef = useRef(0);
    const percentageRef = useRef(0);
    const isResetting = useRef(false);

    const allSteps = [
        { stepName: currentLang.hero.rightContainerText.clientInputText, percentageVal: 0, icon: <LuFileInput /> },
        { stepName: currentLang.hero.rightContainerText.strategyAndMoodText, percentageVal: 15, icon: <FaRegNoteSticky /> },
        { stepName: currentLang.hero.rightContainerText.drawingText, percentageVal: 10, icon: <HiMiniPencilSquare /> },
        { stepName: currentLang.hero.rightContainerText.modellingText, percentageVal: 20, icon: <TbHexagon3D /> },
        { stepName: currentLang.hero.rightContainerText.texturingAndLightingText, percentageVal: 15, icon: <TbTexture /> },
        { stepName: currentLang.hero.rightContainerText.renderingText, percentageVal: 15, icon: <LuClapperboard /> },
        { stepName: currentLang.hero.rightContainerText.postProductionText, percentageVal: 15, icon: <IoCameraOutline /> },
        { stepName: currentLang.hero.rightContainerText.submitionText, percentageVal: 10, icon: <BsSendArrowUp /> },
    ];

    // Keep degree in sync with percentage
    useEffect(() => {
        setDegree(360 * percentage / 100);
    }, [percentage]);

    useEffect(() => {
        let resetTimeout = null;

        const tick = () => {
            if (isResetting.current) return;

            const step = currentStepRef.current;
            const addedPct = allSteps[step].percentageVal;
            const newPct = percentageRef.current + addedPct;
            const isLastStep = step >= allSteps.length - 1;

            if (isLastStep || newPct >= 100) {
                // 1. Snap to exactly 100% and pause
                percentageRef.current = 100;
                setPercentage(100);
                setCurrentStep(step);
                setIsComplete(true);
                setAnimKey(k => k + 1);
                isResetting.current = true;

                // 2. After the pause, reset back to zero
                resetTimeout = setTimeout(() => {
                    percentageRef.current = 0;
                    currentStepRef.current = 0;
                    isResetting.current = false;

                    setPercentage(0);
                    setCurrentStep(0);
                    setIsComplete(false);
                    setAnimKey(k => k + 1);
                }, PAUSE_AT_100_MS);

            } else {
                // Normal step advance
                const nextStep = step + 1;
                currentStepRef.current = nextStep;
                percentageRef.current = newPct;

                setCurrentStep(nextStep);
                setPercentage(newPct);
                setAnimKey(k => k + 1);
            }
        };

        const interval = setInterval(tick, INTERVAL_MS);

        return () => {
            clearInterval(interval);
            if (resetTimeout) clearTimeout(resetTimeout);
        };
    }, []);

    const nextStep = currentStep < allSteps.length - 1 ? currentStep + 1 : 0;

    return (
        <div className={styles.rightContainer}>
            <h1>{currentLang.hero.rightContainerText.projectDashboardText}</h1>

            <div className={styles.contentContainer}>

                <div className={styles.progressBar}>
                    <div
                        className={styles.outerDiv}
                        style={{ '--degree': `${degree}deg` }}
                    ></div>
                    <div className={styles.innerDiv}></div>
                    <div className={styles.progressTextContainer}>
                        <p className={styles.percentageText}>{`${percentage}%`}</p>
                        <span>{isComplete ? "Complete!" : "Complete"}</span>
                    </div>
                </div>

                <div className={styles.stepsContainer}>

                    <div
                        className={styles.phaseContainer}
                        key={`current-${animKey}`}
                    >
                        <div className={styles.svgContainer} key={`svg-current-${animKey}`}>
                            {allSteps[currentStep].icon}
                        </div>
                        <div className={styles.phaseTextContainer}>
                            <p>{currentLang.hero.rightContainerText.projectPhaseText}</p>
                            <h3>{allSteps[currentStep].stepName}</h3>
                        </div>
                    </div>

                    <div className={styles.phaseContainer}>
                        <div className={styles.svgContainer}>
                            {allSteps[nextStep].icon}
                        </div>
                        <div className={styles.phaseTextContainer}>
                            <p>{currentLang.hero.rightContainerText.nextStepText}</p>
                            <h3>{allSteps[nextStep].stepName}</h3>
                        </div>
                    </div>

                    <div className={styles.phaseContainer}>
                        <div className={styles.svgContainer}>
                            <TbExclamationCircle />
                        </div>
                        <div className={styles.phaseTextContainer}>
                            <p>{currentLang.hero.rightContainerText.approvalText}:</p>
                            <h3>Wallpaint hue</h3>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default HeroRightContainer;