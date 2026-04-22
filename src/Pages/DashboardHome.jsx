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
                try {
                    const supabase = await getClient();

                    // .upsert() kullanarak: 
                    // Eğer ID varsa mevcut satırı günceller (UPDATE)
                    // Eğer ID yoksa yeni satır oluşturur (INSERT)
                    const { error } = await supabase
                        .from('profiles')
                        .upsert({
                            id: user.sub,
                            email: user.email,
                            full_name: user.name,
                            avatar_url: user.picture, // Her girişte en güncel linki yazıyoruz
                            updated_at: new Date()    // Güncellenme tarihini de tutmak iyidir
                        }, {
                            onConflict: 'id' // ID çakışması durumunda güncelleme yapacağını belirtiyoruz
                        });

                    if (error) {
                        console.error("Profil senkronizasyon hatası:", error.message);
                    }
                } catch (err) {
                    console.error("Senkronizasyon sırasında sistem hatası:", err);
                }
            };

            syncProfile();
        }
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
    )
}

export default DashboardHome