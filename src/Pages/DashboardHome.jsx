import DashboardInfo from "../components/FlowPageComponents/DashboardInfo";
import styles from "../styles/FlowDashboard.module.css";
import RecentProjects from "../components/FlowPageComponents/RecentProjects";
import { useAuth0, User } from "@auth0/auth0-react";
import { useEffect } from "react";
import supabaseClient from "../config/supabaseClient";

const DashboardHome = () => {

    //ADD USER TO PROFILES TABLE IF USER DOESN'T EXIST
    const { user, isAuthenticated } = useAuth0();
    useEffect(() => {
        if (isAuthenticated && user) {
            const syncProfile = async () => {
                // 1. Check if profile exists
                const { data } = await supabaseClient
                    .from('profiles')
                    .select('*')
                    .eq('id', user.sub)
                    .single();

                // 2. If it doesn't exist, create it (First-time login)
                if (!data) {
                    await supabaseClient.from('profiles').insert({
                        id: user.sub,
                        email: user.email,
                        full_name: user.name,
                        avatar_url: user.picture
                    });
                }
            };
            syncProfile();
        }
    }, [isAuthenticated, user]);


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