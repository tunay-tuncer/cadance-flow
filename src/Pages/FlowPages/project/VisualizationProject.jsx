import { useEffect, useState } from "react";
import styles from "../../../styles/Project.module.css"

import { FaCheck } from "react-icons/fa";

const VisualizationProject = ({ project }) => {
    console.log(project);
    const [phases, setPhases] = useState(project.project_phases);

    const sortPhases = () => {
        const sortedPhases = phases.sort((a, b) => a.order_index - b.order_index);
        console.log(sortedPhases)
        setPhases(sortedPhases)
    }

    useEffect(() => {
        sortPhases()

    }, [])


    return (
        <div className={styles.projectMainContainer}>
            <h1 className={styles.projectHeading}>{project.project_name}</h1>
            <div className={styles.mediaContainer}></div>
            <ul className={styles.phasesContainer}>
                {phases.map((phase) => (
                    <li key={phase.id} className={`${styles.phaseItem} ${phase.is_active ? styles.activePhase : ""}`}>
                        {phase.is_complete && <FaCheck />}
                        <div className={styles.textContainer}>
                            {phase.is_complete && <p className={styles.completeText}>Completed Phase</p>}
                            {phase.is_active && <p className={styles.completeText}>Work In Progress</p>}
                            <p className={styles.phaseName}>{phase.name}</p>
                        </div>
                    </li>
                ))}
            </ul>
            <div className={styles.panoromaContainer}></div>
        </div>
    )
}

export default VisualizationProject