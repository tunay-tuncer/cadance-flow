import { useEffect, useState, useRef } from "react";
import MediaContainer from "../../../components/FlowPageComponents/MediaContainer";
import styles from "../../../styles/Project.module.css"
//REACT ICONS
import { FaCheck } from "react-icons/fa";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";


const VisualizationProject = ({ project, isPublic }) => {
    console.log(project);
    const [phases, setPhases] = useState(project.project_phases);

    const scrollRef = useRef(null);



    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    useEffect(() => {
        const sorted = [...project.project_phases].sort((a, b) => a.order_index - b.order_index);
        setPhases(sorted);

        // Center active phase on load
        setTimeout(() => {
            const activeEl = scrollRef.current?.querySelector(`.${styles.activePhase}`);
            if (activeEl) {
                activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }
        }, 100);
    }, [project.project_phases]);




    const scroll = (direction) => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.5;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className={styles.projectMainContainer}>

            <div className={styles.projectDetailsContainer}>
                <h1 className={styles.projectName}>{project.project_name}</h1>
                <div className={styles.projectDateInfo}>
                    <p className={styles.dateText}>Project Completion </p>
                    <p className={styles.dateValue}>{project.project_progress}%</p>
                </div>
                <div className={styles.projectDateInfo}>
                    <p className={styles.dateText}>Project Start </p>
                    <p className={styles.dateValue}>{formatTime(project.created_at)}</p>
                </div>
                <div className={styles.projectDateInfo}>
                    <p className={styles.dateText}>Estimated Submition: </p>
                    <p className={styles.dateValue}>{formatTime(project.created_at)}</p>
                </div>

            </div>

            <div className={styles.carouselWrapper}>
                <button className={`${styles.arrowBtn}`} onClick={() => scroll("left")}>
                    <MdArrowLeft className={styles.arrowIcon} />
                </button>

                <ul className={styles.phasesViewport} ref={scrollRef}>
                    {phases.map((phase) => (
                        <li
                            key={phase.id}
                            className={`${styles.phaseItem} ${phase.is_active ? styles.activePhase : ""}`}
                        >
                            {phase.is_complete && <FaCheck className={styles.checkIcon} />}
                            <div className={styles.textContainer}>
                                {phase.is_complete && <p className={styles.completeText}>Completed Phase</p>}
                                {phase.is_active && <p className={styles.completeText}>Work In Progress</p>}
                                <p className={styles.phaseName}>{phase.name}</p>
                            </div>
                        </li>
                    ))}
                </ul>

                <button className={styles.arrowBtn} onClick={() => scroll("right")}>
                    <MdArrowRight className={styles.arrowIcon} />
                </button>
            </div>

            <MediaContainer project={project} isPublic={isPublic} />

            <div className={styles.panoromaContainer}></div>

        </div>
    )
}

export default VisualizationProject