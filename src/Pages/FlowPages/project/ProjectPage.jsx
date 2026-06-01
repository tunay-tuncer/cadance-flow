import { useEffect, useState, useRef, useContext } from "react";
import MediaContainer from "../../../components/FlowPageComponents/MediaContainer";
import styles from "../../../styles/Project.module.css"
import { useSupabase } from "../../../hooks/useSupabase";
import { useAuth0 } from "@auth0/auth0-react";
import { ProjectContext } from "../../../context/ProjectContext";
import { ProjectHelmet } from "../../../hooks/usePageHelmet.jsx";
import { metaTags } from "../../../config/metaTags";
import { Joyride, STATUS } from 'react-joyride';
import { getProjectTourSteps } from '../../../config/steps.js';
//REACT ICONS
import { FaCheck } from "react-icons/fa";
import { MdArrowLeft, MdArrowRight, MdPublic, MdLock, MdContentCopy, MdHelpOutline, MdOutlineThumbUp } from "react-icons/md";
import { LiaPencilRulerSolid } from "react-icons/lia";

const ProjectPage = ({ project, isPublic }) => {
    console.log(project);
    const { currentLang, langCode } = useContext(ProjectContext);
    const { getClient } = useSupabase();
    const { user, isAuthenticated } = useAuth0();

    const [phases, setPhases] = useState(project.project_phases);
    const [projectPrivacy, setProjectPrivacy] = useState(project?.is_public);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isApproving, setIsApproving] = useState(false); // Onaylama butonu yükleniyor state'i
    const [runTour, setRunTour] = useState(false);
    const [tourKey, setTourKey] = useState(0);

    const scrollRef = useRef(null);
    const rawSteps = getProjectTourSteps(currentLang, styles);
    const steps = rawSteps.map((step, index) => {
        if (index === 0) {
            return { ...step, disableBeacon: true };
        }
        return step;
    });

    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    const getPhaseName = (phase) => {
        return (langCode === 'tr' ? phase.name_tr : phase.name) || phase.name;
    };

    useEffect(() => {
        const actualProject = Array.isArray(project) ? project[0] : project;
        const rawPhases = actualProject?.project_phases || [];
        const sorted = [...rawPhases].sort((a, b) => a.order_index - b.order_index);
        setPhases(sorted);

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

    const handlePrivacyToggle = async () => {
        if (!isAuthenticated || isUpdating) return;

        const newStatus = !projectPrivacy;

        setProjectPrivacy(newStatus);
        setIsUpdating(true);

        try {
            const supabase = await getClient();

            const { error } = await supabase
                .from('cadance_flow')
                .update({ is_public: newStatus })
                .eq('id', project.id);

            if (error) throw error;

            console.log("Database updated successfully to:", newStatus);
        } catch (err) {
            console.error("Database update failed:", err.message);
            setProjectPrivacy(!newStatus);
            alert("Database update failed: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    // --- YENİ: SUPABASE FAZ ONAYLAMA FONKSİYONU ---
    const handleApprovePhase = async (phaseId, phaseName) => {
        if (isApproving) return;

        const confirmMessage = langCode === 'tr'
            ? `"${phaseName}" aşamasını onaylamak istediğinize emin misiniz? Bu işlem geri alınamaz ve bir sonraki aşamaya geçişi tetikler.`
            : `Are you sure you want to approve the "${phaseName}" phase? This action cannot be undone and will trigger the next stage.`;

        const confirmResult = window.confirm(confirmMessage);
        if (!confirmResult) return;

        setIsApproving(true);

        try {
            const supabase = await getClient();

            const currentPhaseIndex = phases.findIndex(p => p.id === phaseId);
            const nextPhase = phases[currentPhaseIndex + 1]; // order_index sırasına göre dizildiği için bir sonraki eleman

            const { error: currentError } = await supabase
                .from('project_phases')
                .update({ is_complete: true, is_active: false, requires_approval: false })
                .eq('id', phaseId);

            if (currentError) throw currentError;


            if (nextPhase) {
                const { error: nextError } = await supabase
                    .from('project_phases')
                    .update({ is_active: true })
                    .eq('id', nextPhase.id);

                if (nextError) throw nextError;
            }

            setPhases(prevPhases =>
                prevPhases.map((p, index) => {
                    if (p.id === phaseId) {

                        return { ...p, is_complete: true, is_active: false };
                    }
                    if (nextPhase && p.id === nextPhase.id) {

                        return { ...p, is_active: true };
                    }
                    return p;
                })
            );

            // 4. OTOMATİK SCROLL (Yeni aktif olan faza carousel'i kaydır)
            setTimeout(() => {
                const activeEl = scrollRef.current?.querySelector(`.${styles.activePhase}`);
                if (activeEl) {
                    activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                }
            }, 300);

            const successAlert = langCode === 'tr'
                ? "Aşama onaylandı, sıradaki aşama canlı takibe alındı!"
                : "Phase approved, next phase is now live!";
            alert(successAlert);

        } catch (err) {
            console.error("Phase transition failed:", err.message);
            alert("Transition failed: " + err.message);
        } finally {
            setIsApproving(false);
        }
    };

    const copyToClipboard = (number) => {
        const baseUrl = window.location.origin;
        const constructedUrl = `${baseUrl}/track/${number}`;

        navigator.clipboard.writeText(constructedUrl)
            .then(() => {
                alert(currentLang.project.projectInfo.alertText);
            })
            .catch(err => {
                console.error("Link kopyalanamadı:", err);
            });
    };

    const handleJoyrideCallback = (data) => {
        const { action, status } = data;
        if (action === 'skip' || status === STATUS.FINISHED) {
            setRunTour(false);
        }
    };

    const handleStartTourManual = () => {
        setTourKey(prev => prev + 1);
        setRunTour(true);
    };

    const isTurkish = currentLang?.joyrideSteps?.project?.tour?.step1_title?.includes("Kontrol") ?? false;

    const localeLabels = {
        back: isTurkish ? 'Geri' : 'Back',
        close: isTurkish ? 'Kapat' : 'Close',
        last: isTurkish ? 'Bitir' : 'Last',
        next: isTurkish ? 'İleri' : 'Next',
        open: isTurkish ? 'Aç' : 'Open',
        skip: isTurkish ? 'Turu Geç' : 'Skip',
    };

    return (
        <div className={styles.projectMainContainer}>
            <ProjectHelmet projectName={project?.project_name || 'Project'} metaDataObj={metaTags.projectDetails} language={langCode} />
            <Joyride
                key={tourKey}
                steps={steps}
                run={runTour}
                continuous={true}
                showSkipButton={true}
                showProgress={true}
                disableScrolling={false}
                callback={handleJoyrideCallback}
                locale={localeLabels}
                styles={{
                    options: {
                        arrowColor: '#0a0a0f',
                        backgroundColor: '#0a0a0f',
                        overlayColor: 'rgba(2, 2, 5, 0.85)',
                        primaryColor: '#2972f5',
                        textColor: '#ffffff',
                        zIndex: 10000,
                    },
                    tooltip: {
                        backgroundColor: '#0a0a0f',
                        borderRadius: '16px',
                        border: '1px solid rgba(41, 114, 245, 0.2)',
                        padding: '1.5rem',
                    },
                    tooltipContainer: {
                        textAlign: 'left',
                    },
                    tooltipTitle: {
                        color: '#ffffff',
                        fontWeight: '700',
                    },
                    tooltipContent: {
                        color: '#94a3b8',
                        padding: '1rem 0',
                    },
                    buttonNext: {
                        backgroundColor: '#2972f5',
                        borderRadius: '8px',
                        color: '#fff',
                        fontWeight: '600',
                        padding: '10px 20px',
                        boxShadow: '0 0 15px rgba(41, 114, 245, 0.4)'
                    },
                    buttonBack: {
                        color: '#94a3b8',
                        marginRight: '12px',
                    },
                    buttonSkip: {
                        color: '#64748b',
                    }
                }}
            />

            <div className={styles.projectDetailsContainer}>
                <h1 className={styles.projectName}>{project.project_name}</h1>

                <div className={styles.projectInfo}>
                    <div className={styles.accessControlPanel}>
                        <div className={styles.privacySection}>
                            <div className={`${styles.statusIndicator} ${projectPrivacy ? styles.statusLive : styles.statusPrivate}`}>
                                {projectPrivacy ? <MdPublic /> : <MdLock />}
                                <span>{projectPrivacy ? currentLang.project.projectInfo.liveText : currentLang.project.projectInfo.privateText}</span>
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

                        <div className={styles.panelDivider}></div>

                        <div className={styles.trackingSection}>
                            <div className={styles.codeWrapper}>
                                <span className={styles.codeLabel}>{currentLang.project.projectInfo.trackingCodeText}</span>
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
                    <p className={styles.dateText}>{currentLang.project.projectInfo.projectStartText}</p>
                    <p className={styles.dateValue}>{formatTime(project.created_at)}</p>
                </div>
                <div className={styles.projectInfo}>
                    <p className={styles.dateText}>{currentLang.project.projectInfo.submitionText}</p>
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
                            className={`${styles.phaseItem} ${phase.is_active ? styles.activePhase : ""} ${phase.is_complete ? styles.completedPhaseCard : ""}`}
                        >
                            {phase.is_complete && <FaCheck className={styles.checkIcon} />}
                            <div className={styles.textContainer}>
                                {phase.is_complete && <p className={styles.completeText}>{currentLang.project.carousel.completedPhaseText}</p>}
                                {phase.is_active && <p className={styles.completeText}>{currentLang.project.carousel.wipText}</p>}
                                <p className={styles.phaseName}>{getPhaseName(phase)}</p>

                                {/* --- KOŞULLU BUTON ALANI --- */}
                                {/* Aktif faz, onay gerektiriyorsa ve henüz onaylanmadıysa butonu göster */}
                                {phase.is_active && phase.requires_approval && !phase.is_complete && (
                                    <button
                                        className={styles.phaseApproveBtn}
                                        onClick={() => handleApprovePhase(phase.id, getPhaseName(phase))}
                                        disabled={isApproving}
                                    >
                                        <MdOutlineThumbUp />
                                        <span>{langCode === 'tr' ? 'Aşamayı Onayla' : 'Approve Phase'}</span>
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>) : (
                    <ul className={styles.emptyPhasesContainer}>
                        <div className={styles.emptyPhasesIcon}>
                            <LiaPencilRulerSolid />
                        </div>
                        <div className={styles.emptyPhasesText}>
                            <h3>{currentLang.project.carousel.emptyPhaseHeading}</h3>
                            <p>{currentLang.project.carousel.emptyPhaseText}</p>
                        </div>
                        <div className={styles.ghostTimeline}></div>
                    </ul>
                )}

                <button className={styles.arrowBtn} onClick={() => scroll("right")}>
                    <MdArrowRight className={styles.arrowIcon} />
                </button>
            </div>

            <MediaContainer project={project} isPublic={isPublic} />

            <button
                className={styles.projectHowItWorksBtn}
                onClick={handleStartTourManual}
                title={isTurkish ? "Sistem Turunu Başlat" : "Start System Tour"}
            >
                <MdHelpOutline />
                <span>{isTurkish ? "Nasıl Çalışır?" : "How it Works?"}</span>
            </button>

        </div>
    )
}

export default ProjectPage