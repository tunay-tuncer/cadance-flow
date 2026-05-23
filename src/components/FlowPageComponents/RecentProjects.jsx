import { useEffect, useState } from "react";
import { useFetchProjects } from "../../hooks/useFetchProject";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router";
import { useSupabase } from "../../hooks/useSupabase";
//STYLES
import styles from "../../styles/FlowDashboard.module.css";
//REACT ICONS
import { LiaPencilRulerSolid } from "react-icons/lia";
import { TbCube3dSphere } from "react-icons/tb";
import { MdOutlineEngineering, MdArchive } from "react-icons/md";

const RecentProjects = () => {
    const { user } = useAuth0();
    const { projects, loading } = useFetchProjects(user);
    const { getClient } = useSupabase();
    const [unArchivedProjects, setUnArchivedProjects] = useState([])

    const renderProjectIcon = (type) => {
        if (type === "viz") return <LiaPencilRulerSolid />;
        if (type === "renovation") return <TbCube3dSphere />;
        if (type === "drawing") return <MdOutlineEngineering />;
        return null;
    };

    useEffect(() => {
        if (!projects) return;

        const filteredProjects = projects.filter((project) => !project.is_archived)
        setUnArchivedProjects(filteredProjects)

    }, [projects])

    const handleProjectArchive = async (e, projectId) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(projectId)

        try {
            const supabase = await getClient();
            const { error } = await supabase
                .from('cadance_flow')
                .update({ is_archived: true })
                .eq('id', projectId);

            if (error) throw error;

            setUnArchivedProjects(prev => prev.filter(p => p.id !== projectId));

        } catch (err) {
            console.error("Arşivleme hatası:", err.message);
            alert("Proje arşivlenemedi.");
        }
    }

    const SkeletonLoader = () => (
        <style>{`
            @keyframes shimmer {
                0% { background-position: -1000px 0; }
                100% { background-position: 1000px 0; }
            }
            .projectSkeleton {
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
            .skeletonImageContainer {
                width: 100%;
                aspect-ratio: 16/9;
            }
            .skeletonProjectName {
                height: 1.2rem;
                width: 80%;
                margin-bottom: 0.5rem;
            }
            .skeletonProgressBar {
                height: 5px;
                width: 100%;
                margin-bottom: 0.5rem;
            }
            .skeletonProgressText {
                height: 0.8rem;
                width: 30%;
                margin-bottom: 0.5rem;
            }
            .skeletonLastUpdate {
                height: 0.7rem;
                width: 60%;
            }
        `}</style>
    );
    if (loading) {
        return (
            <>
                <SkeletonLoader />
                <h1>RECENT PROJECTS</h1>
                <ul className={styles.projectMainContainer}>
                    {[1, 2, 3].map((idx) => (
                        <li key={idx} className={styles.projectListItem} style={{ pointerEvents: 'none' }}>
                            <div style={{ cursor: 'not-allowed' }}>
                                <div className={styles.imageContainer}>
                                    <div className="projectSkeleton skeletonImageContainer"></div>
                                </div>
                                <div className={styles.projectInfoContainer}>
                                    <div className={styles.projectNameContainer}>
                                        <div className="projectSkeleton skeletonProjectName"></div>
                                    </div>
                                    <div className={styles.progressContainer}>
                                        <div className="projectSkeleton skeletonProgressBar"></div>
                                        <div className="projectSkeleton skeletonProgressText"></div>
                                    </div>
                                    <div className="projectSkeleton skeletonLastUpdate"></div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </>
        );
    }

    return (
        <>
            <h1>RECENT PROJECTS</h1>
            <ul className={styles.projectMainContainer}>
                {projects?.length === 0 ? (
                    <p>NO PROJECTS FOUND</p>
                ) : (

                    unArchivedProjects.map((project) => (
                        <li key={project.id} className={styles.projectListItem}>
                            <Link to={`/dashboard/project/${project.id}`}>
                                <div className={styles.imageContainer}>
                                    <img
                                        className={styles.projectPicture}
                                        src={project.thumbnail_url || project.pic}
                                        alt={project.project_name}
                                    />

                                </div>

                                <MdArchive className={styles.archiveIcon} onClick={(e) => handleProjectArchive(e, project.id)} />

                                <div className={styles.projectInfoContainer}>
                                    <div className={styles.projectNameContainer}>
                                        <h2>{project.project_name?.toUpperCase() || "UNTITLED"}</h2>
                                        <div className={styles.projectTypeIcon}>
                                            {renderProjectIcon(project.project_type)}
                                        </div>
                                    </div>

                                    <div className={styles.progressContainer}>
                                        <div className={styles.projectProgressOuter}>
                                            <div
                                                className={styles.progressInner}
                                                style={{ width: `${project.project_progress || 0}%` }}
                                            ></div>
                                        </div>
                                        <p>{`${project.project_progress || 0}%`}</p>
                                    </div>

                                    <p className={styles.projectLastUpdate}>
                                        Last Update: {new Date(project.project_last_update).toLocaleDateString("tr-TR")}
                                    </p>
                                </div>
                            </Link>
                        </li>
                    ))
                )}
            </ul>
        </>
    );
};

export default RecentProjects;