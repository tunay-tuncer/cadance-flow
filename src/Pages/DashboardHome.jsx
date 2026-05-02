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

                // Check if profile already exists
                const { data: existing } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('id', user.sub)
                    .limit(1);

                if (existing && existing.length > 0) {
                    // Profile exists — only update non-sensitive fields
                    await supabase
                        .from('profiles')
                        .update({
                            full_name: user.name,
                            avatar_url: user.picture,
                        })
                        .eq('id', user.sub);
                } else {
                    // New user — insert with default role
                    await supabase
                        .from('profiles')
                        .insert({
                            id: user.sub,
                            email: user.email,
                            full_name: user.name,
                            avatar_url: user.picture,
                        });
                }

                hasSynced.current = true;
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