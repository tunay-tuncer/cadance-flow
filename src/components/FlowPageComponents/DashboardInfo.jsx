import { useEffect, useState, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useFetchProjects } from "../../hooks/useFetchProject";
import { ProjectContext } from "../../context/ProjectContext";
//STYLES
import styles from "../../styles/FlowDashboard.module.css"
//REACT ICONS
import { FiLoader } from "react-icons/fi";
import { FaCheck, FaRegClock } from "react-icons/fa";
import { TbExclamationCircle } from "react-icons/tb";

const DashboardInfo = () => {
    const { user } = useAuth0();
    const { projects, loading, logs } = useFetchProjects(user);

    const { currentLang } = useContext(ProjectContext);

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

    const SkeletonLoader = () => (
        <style>{`
            @keyframes shimmer {
                0% { background-position: -1000px 0; }
                100% { background-position: 1000px 0; }
            }
            .skeleton {
                background: linear-gradient(
                    90deg,
                    var(--containerGray) 0%,
                    rgba(41, 114, 245, 0.1) 50%,
                    var(--containerGray) 100%
                );
                background-size: 1000px 100%;
                animation: shimmer 2s infinite;
                border-radius: 0.5rem;
            }
            .skeletonGreeting {
                height: 1.2rem;
                width: 60%;
                margin: 0 auto;
            }
            .skeletonValue {
                height: 2rem;
                width: 80%;
                margin: 0 auto;
                margin-bottom: 0.5rem;
            }
            .skeletonLabel {
                height: 0.75rem;
                width: 70%;
                margin: 0 auto;
            }
            .skeletonLogItem {
                height: 0.9rem;
                width: 90%;
                margin-bottom: 0.5rem;
            }
            .skeletonLogTime {
                height: 0.7rem;
                width: 60%;
                margin-bottom: 1rem;
            }
        `}</style>
    );

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

    if (loading) {
        return (
            <>
                <SkeletonLoader />
                <ul className={styles.infoContainer}>
                    <li className={styles.infoElement} key="greeting">
                        <div className="skeleton skeletonGreeting"></div>
                    </li>
                    <li className={styles.infoElement} key="totalCompletion">
                        <div className="skeleton skeletonValue"></div>
                        <div className="skeleton skeletonLabel"></div>
                    </li>
                    <li className={styles.infoElement} key="finishedProjectCount">
                        <div className="skeleton skeletonValue"></div>
                        <div className="skeleton skeletonLabel"></div>
                    </li>
                    <li className={styles.infoElement} key="approvalCount">
                        <div className="skeleton skeletonValue"></div>
                        <div className="skeleton skeletonLabel"></div>
                    </li>
                    <li className={styles.infoElement} key="logs">
                        <div className="skeleton skeletonLabel" style={{ marginBottom: "1rem" }}></div>
                        <div className="skeleton skeletonLogItem"></div>
                        <div className="skeleton skeletonLogTime"></div>
                        <div className="skeleton skeletonLogItem"></div>
                        <div className="skeleton skeletonLogTime"></div>
                        <div className="skeleton skeletonLogItem"></div>
                        <div className="skeleton skeletonLogTime"></div>
                    </li>
                </ul>
            </>
        );
    }

    return (
        <>
            <ul className={styles.infoContainer}>
                <li className={styles.infoElement} key="greeting">
                    <p>{currentLang.projectDashboard.welcomeText}, <span>{user?.name.toUpperCase()}</span></p>
                </li>
                <li className={styles.infoElement} key="totalCompletion">
                    <p className={styles.infoValue}>{completion}%</p>
                    <p className={styles.infoName}>{currentLang.projectDashboard.completionText}</p>
                </li>
                <li className={styles.infoElement} key="finishedProjectCount">
                    <p className={styles.infoValue}>{finishedProjectCount}</p>
                    <p className={styles.infoName}>{currentLang.projectDashboard.finishedProjectsText}</p>
                </li>
                <li className={styles.infoElement} key="approvalCount">
                    <p className={styles.infoValue}>{approvalCount}</p>
                    <p className={styles.infoName}>{currentLang.projectDashboard.approvalRequiredText}</p>
                </li>
                <li className={styles.infoElement} key="logs">
                    <p className={styles.infoName}>{currentLang.projectDashboard.historyText}</p>
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