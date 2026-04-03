import { Link } from "react-router";
import styles from "../../styles/FlowDashboard.module.css";

const RecentProjects = () => {
    const projects = [
        { id: 1, name: "PROJECT 001", completion: 70, lastUpdate: "17/03/2026", pic: "https://res.cloudinary.com/dabmjz0xr/image/upload/q_auto/f_auto/v1771601832/S1.1080_sqvbmx.png" },
        { id: 2, name: "PROJECT 002", completion: 50, lastUpdate: "17/03/2026", pic: "https://res.cloudinary.com/dabmjz0xr/image/upload/q_auto/f_auto/v1771601832/S1.1080_sqvbmx.png" },
        { id: 3, name: "PROJECT 003", completion: 70, lastUpdate: "17/03/2026", pic: "https://res.cloudinary.com/dabmjz0xr/image/upload/q_auto/f_auto/v1771601832/S1.1080_sqvbmx.png" },
    ]

    return (
        <>
            <h1>RECENT PROJECTS</h1>
            <ul className={styles.projectMainContainer}>
                {projects.map((project) => (
                    <Link to={`/dashboard/project/${project.id}`} key={project.id}>

                        <div className={styles.imageContainer}>
                            <img className={styles.projectPicture} src={project.pic} alt={project.name} />
                        </div>

                        <div className={styles.projectInfoContainer}>
                            <h2>{project.name}</h2>
                            <div className={styles.progressContainer}>
                                <div className={styles.projectProgressOuter}>
                                    <div className={styles.progressInner}></div>
                                </div>
                                <p>{`${project.completion}%`}</p>
                            </div>
                            <p className={styles.projectLastUpdate}>{project.lastUpdate}</p>
                        </div>

                    </Link>
                ))}
            </ul>
        </>
    )
}

export default RecentProjects