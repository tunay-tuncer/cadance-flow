import DashboardInfo from "../components/FlowPageComponents/DashboardInfo";
import styles from "../styles/FlowDashboard.module.css";
import RecentProjects from "../components/FlowPageComponents/RecentProjects";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";
import { useSupabase } from "../hooks/useSupabase";

const DashboardHome = () => {
    const { user, isAuthenticated } = useAuth0();
    const { getClient } = useSupabase();
    const hasSynced = useRef(false);

    useEffect(() => {
        if (!isAuthenticated || !user || hasSynced.current) return;

        const syncProfile = async () => {
            try {
                const supabase = await getClient();

                const { error } = await supabase
                    .from('profiles')
                    .upsert({
                        id: user.sub,
                        email: user.email,
                        full_name: user.name,
                        avatar_url: user.picture,
                        role: 'client', // new users default to client
                    }, {
                        onConflict: 'id',
                        ignoreDuplicates: false, // update avatar/name if user already exists
                    });

                if (error) {
                    console.error("Profil senkronizasyon hatası:", error.message);
                } else {
                    hasSynced.current = true;
                }
            } catch (err) {
                console.error("Senkronizasyon hatası:", err);
            }
        };

        syncProfile();
    }, [isAuthenticated, user, getClient]);

    return (
        <div className={styles.dashboardContainer}>
            <section className={styles.infoMainContainer}>
                <DashboardInfo />
            </section>
            <section className={styles.infoMainContainer}>
                <RecentProjects />
            </section>
        </div>
    );
};

export default DashboardHome;