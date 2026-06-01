import { useEffect, useState, useContext } from "react";
import { useFetchProjects } from "../../hooks/useFetchProject";
import { useSupabase } from "../../hooks/useSupabase";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router";
import { PageHelmet } from "../../hooks/usePageHelmet.jsx";
import { metaTags } from "../../config/metaTags";
import { ProjectContext } from "../../context/ProjectContext";
import styles from "../../styles/Archive.module.css";
import Loader from "../../components/Loader";

// ICONS
import { MdUnarchive, MdOutlineInventory2, MdCalendarMonth } from "react-icons/md";
import { LiaPencilRulerSolid } from "react-icons/lia";

const Archive = () => {
    const { user } = useAuth0();
    const { getClient } = useSupabase();
    const { langCode } = useContext(ProjectContext);
    const { projects, loading } = useFetchProjects(user);
    const [archivedList, setArchivedList] = useState([]);

    useEffect(() => {
        if (projects) {
            setArchivedList(projects.filter(p => p.is_archived));
        }
    }, [projects]);

    const handleUnarchive = async (e, projectId) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const supabase = await getClient();
            const { error } = await supabase
                .from('cadance_flow')
                .update({ is_archived: false })
                .eq('id', projectId);

            if (error) throw error;
            setArchivedList(prev => prev.filter(p => p.id !== projectId));
        } catch (err) {
            console.error("Geri getirme hatası:", err.message);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className={styles.archiveMainContainer}>
            <PageHelmet metaData={metaTags.archive} language={langCode} />
            <header className={styles.archiveHeader}>
                <div className={styles.titleGroup}>
                    <MdOutlineInventory2 className={styles.mainIcon} />
                    <h1>ARCHIVE</h1>
                </div>
                <p>You have {archivedList.length} completed projects in your vault.</p>
            </header>

            <div className={styles.archiveGrid}>
                {archivedList.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>Your archive is empty.</p>
                    </div>
                ) : (
                    archivedList.map((project) => (
                        <div key={project.id} className={styles.archiveCard}>
                            <Link to={`/dashboard/project/${project.id}`} className={styles.cardLink}>
                                <div className={styles.imageOverlay}>
                                    <img src={project.thumbnail_url || project.pic} alt={project.project_name} />
                                    <div className={styles.statusTag}>ARCHIVED</div>
                                </div>

                                <div className={styles.cardContent}>
                                    <div className={styles.cardHeader}>
                                        <h3>{project.project_name}</h3>
                                        <button
                                            className={styles.unarchiveBtn}
                                            onClick={(e) => handleUnarchive(e, project.id)}
                                            title="Restore Project"
                                        >
                                            <MdUnarchive />
                                        </button>
                                    </div>

                                    <div className={styles.cardMeta}>
                                        <div className={styles.metaItem}>
                                            <MdCalendarMonth />
                                            <span>{new Date(project.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className={styles.metaItem}>
                                            <LiaPencilRulerSolid />
                                            <span>{project.project_type?.toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Archive;