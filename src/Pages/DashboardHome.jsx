import DashboardInfo from "../components/FlowPageComponents/DashboardInfo";
import styles from "../styles/FlowDashboard.module.css";
import RecentProjects from "../components/FlowPageComponents/RecentProjects";

const DashboardHome = () => {


    return (
        <div className={styles.dashboardContainer}>
            <section className={styles.infoMainContainer}>
                <DashboardInfo />

            </section>

            <section className={styles.infoMainContainer}>

                <RecentProjects />
            </section>
        </div>
    )
}

export default DashboardHome