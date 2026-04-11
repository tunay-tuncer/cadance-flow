import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useFetchProjects } from "../../hooks/useFetchProject";
import styles from "../../styles/FlowDashboard.module.css"
//REACT ICONS
import { FiLoader } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { TbExclamationCircle } from "react-icons/tb";
import { FaRegClock } from "react-icons/fa";

const DashboardInfo = () => {
    const { user } = useAuth0();
    const { projects, loading, logs } = useFetchProjects(user);

    const [completion, setCompletion] = useState(0);
    const [finishedProjectCount, setFinishedProjectCount] = useState(0);
    const [approvalCount, setApprovalCount] = useState(2);
    const [projectLogs, setProjectLogs] = useState([]);


    useEffect(() => {
        handleCompletion();
        handleFinishedProjects();
        handleLogs();
    }, [loading, projects])

    const handleCompletion = () => {
        let currentCompletion = 0;

        if (!loading && projects && projects.length > 0) {
            projects.forEach(element => {
                currentCompletion += element.project_progress
            });
            setCompletion(currentCompletion / projects.length)
        }

    }

    const handleFinishedProjects = () => {
        let currentCompletedProjectCount = 0;

        if (!loading && projects && projects.length > 0) {
            projects.forEach(element => {
                element.project_progress === 100 ? currentCompletedProjectCount += 1 : currentCompletedProjectCount
            });
            setFinishedProjectCount(currentCompletedProjectCount)
        }
    }


    const handleLogs = () => {
        if (!loading && logs) {
            setProjectLogs(logs)
        }
    }

    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${hours}:${minutes} - ${day}/${month}/${year}`;
    }

    return (
        <>
            <h1>PROJECT DASHBOARD</h1>
            <ul className={styles.infoContainer}>
                <li className={styles.infoElement} key="greeting">
                    <p>WELCOME BACK, <span>{user?.name.toUpperCase()}</span></p>
                </li>
                <li className={styles.infoElement} key="totalCompletion">
                    <p className={styles.infoValue}>{completion}%</p>
                    <p className={styles.infoName}>TOTAL COMPLETION</p>
                </li>
                <li className={styles.infoElement} key="finishedProjectCount">
                    <p className={styles.infoValue}>{finishedProjectCount}</p>
                    <p className={styles.infoName}>FINISHED PROJECTS</p>
                </li>
                <li className={styles.infoElement} key="approvalCount">
                    <p className={styles.infoValue}>{approvalCount}</p>
                    <p className={styles.infoName}>APPROVAL REQUIRED</p>
                </li>
                <li className={styles.infoElement} key="logs">
                    <p className={styles.infoName}>HISTORY</p>
                    {projectLogs?.map((log, id) => (
                        <div className={styles.logItem} key={id}>
                            <p className={styles.logEvent}>{log.message}</p>
                            <p className={styles.logTime}>{formatTime(log.created_at)}</p>
                        </div>
                    ))}
                </li>
            </ul>
        </>
    )
}

export default DashboardInfo