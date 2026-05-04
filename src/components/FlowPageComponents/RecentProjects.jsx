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
    const { projects } = useFetchProjects(user);
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