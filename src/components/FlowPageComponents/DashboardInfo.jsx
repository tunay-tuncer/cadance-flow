import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useFetchProjects } from "../../hooks/useFetchProject";
import styles from "../../styles/FlowDashboard.module.css"
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
        if (loading) return;
        handleCompletion();
        handleFinishedProjects();
    }, [loading, projects]);

    // logs için ayrı useEffect — logs gelince tetiklenir
    useEffect(() => {
        if (!loading && logs) {
            setProjectLogs(logs);
        }
    }, [loading, logs]);

    const handleCompletion = () => {
        if (projects && projects.length > 0) {
            const total = projects.reduce((sum, p) => sum + (p.project_progress || 0), 0);
            setCompletion(Math.round(total / projects.length));
        }
    };

    const handleFinishedProjects = () => {
        if (projects && projects.length > 0) {
            const count = projects.filter(p => p.project_progress === 100).length;
            setFinishedProjectCount(count);
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes} - ${day}/${month}/${year}`;
    };

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
                    {projectLogs.length === 0 ? (
                        <p>No history found.</p>
                    ) : (
                        projectLogs.map((log, id) => (
                            <div className={styles.logItem} key={id}>
                                <p className={styles.logEvent}>{log.message}</p>
                                <p className={styles.logTime}>{formatTime(log.created_at)}</p>
                            </div>
                        ))
                    )}
                </li>
            </ul>
        </>
    );
};

export default DashboardInfo;