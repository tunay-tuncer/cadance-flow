import { useState } from "react";
import styles from "../../styles/FlowDashboard.module.css"
//REACT ICONS
import { FiLoader } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { TbExclamationCircle } from "react-icons/tb";
import { FaRegClock } from "react-icons/fa";

const DashboardInfo = () => {

    const getFormattedTime = () => {
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(new Date());
    };

    const [completion, setCompletion] = useState(45);
    const [finishedProjectCount, setFinishedProjectCount] = useState(3);
    const [approvalCount, setApprovalCount] = useState(2);
    const [lastUpdate, setLastUpdate] = useState(getFormattedTime());

    const infoElements = [
        { id: "totalCompletion", name: "TOTAL COMPLETION", value: `${completion}%`, icon: <FiLoader />, color: "lightgreen" },
        { id: "finishedProject", name: "FINISHED PROJECTS", value: finishedProjectCount, icon: <FaCheck />, color: "var(--accent)" },
        { id: "approval", name: "APPROVAL REQUIRED", value: approvalCount, icon: <TbExclamationCircle />, color: "red" },
        { id: "lastUpdate", name: "LAST UPDATED", value: lastUpdate, icon: <FaRegClock />, color: "var(--grayDark)" },
    ]

    return (
        <>
            <h1>PROJECT DASHBOARD</h1>
            <ul className={styles.infoContainer}>
                {infoElements.map((element) => (
                    <li key={element.id} style={{ color: element.color }}>
                        {element.icon}
                        <p className={styles.infoValue}>{element.value}</p>
                        <p className={styles.infoName}>{element.name}</p>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default DashboardInfo