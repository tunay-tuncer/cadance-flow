import { useEffect, useState } from "react";
import { useFetchProjects } from "../../hooks/useFetchProject";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router";
//STYLES
import styles from "../../styles/FlowDashboard.module.css";
//REACT ICONS
import { LiaPencilRulerSolid } from "react-icons/lia";
import { TbCube3dSphere } from "react-icons/tb";
import { MdOutlineEngineering } from "react-icons/md";

const RecentProjects = () => {
    const { user } = useAuth0();
    const { projects } = useFetchProjects(user);

    const renderProjectIcon = (type) => {
        if (type === "viz") return <LiaPencilRulerSolid />;
        if (type === "renovation") return <TbCube3dSphere />;
        if (type === "drawing") return <MdOutlineEngineering />;
        return null;
    };


    return (
        <>
            <h1>RECENT PROJECTS</h1>
            <ul className={styles.projectMainContainer}>
                {projects?.length === 0 ? (
                    <p>NO PROJECTS FOUND</p>
                ) : (
                    projects.map((project) => (
                        <li key={project.id} className={styles.projectListItem}>
                            <Link to={`/dashboard/project/${project.id}`}>
                                <div className={styles.imageContainer}>
                                    <img
                                        className={styles.projectPicture}
                                        src={project.thumbnail_url || project.pic}
                                        alt={project.project_name}
                                    />
                                </div>

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
                                        {/* 4. Formatting the Supabase timestamp */}
                                        Last Update: {new Date(project.project_last_update).toLocaleDateString()}
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