import DashboardInfo from "../components/FlowPageComponents/DashboardInfo";
import styles from "../styles/FlowDashboard.module.css";
import RecentProjects from "../components/FlowPageComponents/RecentProjects";
import { useAuth0, User } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useSupabase } from "../hooks/useSupabase";

const DashboardHome = () => {

    //ADD USER TO PROFILES TABLE IF USER DOESN'T EXIST
    const { user, isAuthenticated } = useAuth0();
    const { getClient } = useSupabase();
    useEffect(() => {
        if (isAuthenticated && user) {
            const syncProfile = async () => {
                // 1. Check if profile exists
                const supabase = await getClient();
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.sub)
                    .single();

                // 2. If it doesn't exist, create it (First-time login)
                if (!data) {
                    await supabase.from('profiles').insert({
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