import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "../../styles/FlowDashboard.module.css"
//REACT ICONS
import { FiLoader } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { TbExclamationCircle } from "react-icons/tb";
import { FaRegClock } from "react-icons/fa";

const DashboardInfo = () => {

    const { user } = useAuth0();

    const getFormattedTime = () => {
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(new Date());
    };

    const [userName, setUserName] = useState("Tunay");
    const [completion, setCompletion] = useState(45);
    const [finishedProjectCount, setFinishedProjectCount] = useState(3);
    const [approvalCount, setApprovalCount] = useState(2);
    const [lastUpdate, setLastUpdate] = useState(getFormattedTime());


    const logs = [
        { date: "15/03/2026", time: "16:05", event: "PHASE UPDATED" },
        { date: "15/03/2026", time: "15:44", event: "MATERIAL ADJUSTED" },
        { date: "14/03/2026", time: "09:32", event: "MEDIA UPLOADED" },
        { date: "13/03/2026", time: "13:15", event: "PROJECT_3 ARCHIVED" },
    ]

    return (
        <>
            <h1>PROJECT DASHBOARD</h1>
            <ul className={styles.infoContainer}>
                <li className={styles.infoElement} id="greeting">
                    <p>WELCOME BACK, <span>{user?.name.toUpperCase()}</span></p>
                </li>
                <li className={styles.infoElement} id="totalCompletion">
                    <p className={styles.infoValue}>{completion}%</p>
                    <p className={styles.infoName}>TOTAL COMPLETION</p>
                </li>
                <li className={styles.infoElement} id="totalCompletion">
                    <p className={styles.infoValue}>{finishedProjectCount}</p>
                    <p className={styles.infoName}>FINISHED PROJECTS</p>
                </li>
                <li className={styles.infoElement} id="totalCompletion">
                    <p className={styles.infoValue}>{approvalCount}</p>
                    <p className={styles.infoName}>APPROVAL REQUIRED</p>
                </li>
                <li className={styles.infoElement} id="logs">
                    <p className={styles.infoName}>HISTORY</p>
                    {logs.map((log) => (
                        <div className={styles.logItem}>
                            <p className={styles.logEvent}>{log.event}</p>
                            <p className={styles.logTime}>{log.time} - <span>{log.date}</span></p>
                        </div>
                    ))}
                </li>
            </ul>
        </>
    )
}

export default DashboardInfo