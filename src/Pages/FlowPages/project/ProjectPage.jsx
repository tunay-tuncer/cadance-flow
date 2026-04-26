import { useEffect, useState, useRef, use } from "react";
import MediaContainer from "../../../components/FlowPageComponents/MediaContainer";
import styles from "../../../styles/Project.module.css"
import { useAuth0 } from "@auth0/auth0-react";
//REACT ICONS
import { FaCheck } from "react-icons/fa";
import { MdArrowLeft, MdArrowRight, MdPublic, MdLock, MdContentCopy } from "react-icons/md";
import { LiaPencilRulerSolid } from "react-icons/lia";


const ProjectPage = ({ project, isPublic }) => {
    console.log(project);
    const { user, isAuthenticated } = useAuth0();
    const [phases, setPhases] = useState(project.project_phases);
    const [projectPrivacy, setProjectPrivacy] = useState(project?.is_public);

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
        const actualProject = Array.isArray(project) ? project[0] : project;
        const rawPhases = actualProject?.project_phases || [];
        const sorted = [...rawPhases].sort((a, b) => a.order_index - b.order_index);
        setPhases(sorted);

        // Center active phase on load
        setTimeout(() => {
            const activeEl = scrollRef.current?.querySelector(`.${styles.activePhase}`);
            if (activeEl) {
                activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }
        }, 100);
    }, [project]);


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

    const handlePrivacyToggle = () => {
        if (!isAuthenticated) return
        setProjectPrivacy((prev) => !prev)
        console.log(projectPrivacy)
    }

    const copyToClipboard = (number) => {
        const baseUrl = window.location.origin;
        const constructedUrl = `${baseUrl}/track/${number}`;

        navigator.clipboard.writeText(constructedUrl)
            .then(() => {
                alert("Link copied to clipboard!");
            })
            .catch(err => {
                console.error("Link kopyalanamadı:", err);
            });
    };

    return (
        <div className={styles.projectMainContainer}>

            <div className={styles.projectDetailsContainer}>
                <h1 className={styles.projectName}>{project.project_name}</h1>

                <div className={styles.projectInfo}>
                    <div className={styles.accessControlPanel}>
                        {/* Gizlilik Bölümü */}
                        <div className={styles.privacySection}>
                            <div className={`${styles.statusIndicator} ${projectPrivacy ? styles.statusLive : styles.statusPrivate}`}>
                                {projectPrivacy ? <MdPublic /> : <MdLock />}
                                <span>{projectPrivacy ? "LIVE" : "PRIVATE"}</span>
                            </div>

                            <button
                                className={`${styles.toggleSwitch} ${projectPrivacy ? styles.toggleActive : ""}`}
                                style={{ cursor: isAuthenticated ? "pointer" : "not-allowed" }}
                                onClick={handlePrivacyToggle}
                                title={projectPrivacy ? "Make Private" : "Make Public"}
                            >
                                <div className={styles.toggleKnob}></div>
                            </button>
                        </div>

                        {/* Ayraç Çizgisi */}
                        <div className={styles.panelDivider}></div>

                        {/* Takip Kodu Bölümü */}
                        <div className={styles.trackingSection}>
                            <div className={styles.codeWrapper}>
                                <span className={styles.codeLabel}>TRACKING CODE:</span>
                                <code className={styles.codeValue}>{project.tracking_number}</code>
                            </div>
                            <button
                                className={styles.copyIconButton}
                                onClick={() => copyToClipboard(project.tracking_number)}
                                title="Copy Code"
                            >
                                <MdContentCopy />
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.projectInfo}>
                    <p className={styles.dateText}>Project Start </p>
                    <p className={styles.dateValue}>{formatTime(project.created_at)}</p>
                </div>
                <div className={styles.projectInfo}>
                    <p className={styles.dateText}>Estimated Submition: </p>
                    <p className={styles.dateValue}>{formatTime(project.created_at)}</p>
                </div>

            </div>

            <div className={styles.carouselWrapper}>
                <button className={`${styles.arrowBtn}`} onClick={() => scroll("left")}>
                    <MdArrowLeft className={styles.arrowIcon} />
                </button>

                {phases?.length > 0 ? (<ul className={styles.phasesViewport} ref={scrollRef}>
                    {phases?.map((phase) => (
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
                </ul>) : (
                    <ul className={styles.emptyPhasesContainer}>
                        <div className={styles.emptyPhasesIcon}>
                            <LiaPencilRulerSolid />
                        </div>
                        <div className={styles.emptyPhasesText}>
                            <h3>Roadmap is being prepared</h3>
                            <p>We are currently outlining the project stages. Your timeline will appear here shortly.</p>
                        </div>
                        <div className={styles.ghostTimeline}></div>
                    </ul>
                )}

                <button className={styles.arrowBtn} onClick={() => scroll("right")}>
                    <MdArrowRight className={styles.arrowIcon} />
                </button>
            </div>

            <MediaContainer project={project} isPublic={isPublic} />

        </div>
    )
}

export default ProjectPage