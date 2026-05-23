//DEPENDENCIES
import { Joyride, STATUS } from 'react-joyride';
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect, useRef, useContext } from "react";
import { useSupabase } from "../hooks/useSupabase";
import { ProjectContext } from "../context/ProjectContext.jsx";
//STYLES
import styles from "../styles/FlowDashboard.module.css";
//COMPONENTS
import DashboardInfo from "../components/FlowPageComponents/DashboardInfo";
import RecentProjects from "../components/FlowPageComponents/RecentProjects";
import { getDashboardTourSteps } from '../config/steps.js';
//REACT ICONS
import { MdHelpOutline } from "react-icons/md";

const DashboardHome = () => {
    const { user, isAuthenticated } = useAuth0();
    const { getClient } = useSupabase();
    const hasSynced = useRef(false);

    const { currentLang } = useContext(ProjectContext);

    const [runTour, setRunTour] = useState(false);
    const [tourKey, setTourKey] = useState(0);
    const steps = getDashboardTourSteps(currentLang, styles);

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('cadance_dashboard_tour_seen');

        if (hasSeenTour === 'true') {
            return;
        }
        const timer = setTimeout(() => {
            setRunTour(true);
            localStorage.setItem('cadance_dashboard_tour_seen', 'true');
        }, 1500);

        return () => clearTimeout(timer);
    }, []);


    // --- PROFIL SENKRONIZASYONU ---
    useEffect(() => {
        if (!isAuthenticated || !user || hasSynced.current) return;

        const syncProfile = async () => {
            try {
                const supabase = await getClient();
                const { data: existing } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('id', user.sub)
                    .limit(1);

                if (existing && existing.length > 0) {
                    await supabase
                        .from('profiles')
                        .update({
                            full_name: user.name,
                            avatar_url: user.picture
                        })
                        .eq('id', user.sub);
                } else {
                    await supabase
                        .from('profiles')
                        .insert([
                            {
                                id: user.sub,
                                email: user.email,
                                full_name: user.name,
                                avatar_url: user.picture
                            }
                        ]);
                }
                hasSynced.current = true;
            } catch (err) {
                console.error("Profile sync failed:", err);
            }
        };

        syncProfile();
    }, [isAuthenticated, user, getClient]);


    // --- JOYRIDE CALLBACK KONTROLÜ ---
    const handleJoyrideCallback = (data) => {
        const { status } = data;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            setRunTour(false);
        }
    };

    const handleStartTourManual = () => {
        // Stop first, then restart on next tick so Joyride resets properly
        setRunTour(false);
        setTimeout(() => {
            setTourKey(prev => prev + 1);
            setRunTour(true);
        }, 100);
    };

    // --- DEĞİŞİKLİK 2: BUTON METİNLERİNİ DİNAMİK YAPMA ---
    // Eğer currentLang objende projenin dilini belirten bir anahtar (örn: code: "tr" veya doğrudan bir kontrol) yoksa,
    // adımları çektiğimiz dashboardTour objesinin varlığı üzerinden basitçe hangi dilde olduğumuzu anlayabiliriz.
    // Varsayılan olarak butonları tr/en durumuna göre eşitleyelim:
    const isTurkish = currentLang?.joyrideSteps?.dashboard?.tour?.step1_title?.includes("Hoş Geldiniz") ?? false;

    const localeLabels = {
        back: isTurkish ? 'Geri' : 'Back',
        close: isTurkish ? 'Kapat' : 'Close',
        last: isTurkish ? 'Bitir' : 'Last',
        next: isTurkish ? 'İleri' : 'Next',
        open: isTurkish ? 'Aç' : 'Open',
        skip: isTurkish ? 'Turu Geç' : 'Skip',
    };

    return (
        <div className={styles.dashboardContainer}>
            <Joyride
                key={tourKey}
                steps={steps}
                run={runTour}
                continuous={true}
                showSkipButton={true}
                showProgress={true}
                disableScrolling={false}
                callback={handleJoyrideCallback}
                locale={localeLabels} // --- DEĞİŞİKLİK 3: Yerelleştirilmiş butonlar enjekte edildi ---
                styles={{
                    options: {
                        arrowColor: '#0a0a0f',
                        backgroundColor: '#0a0a0f',
                        overlayColor: 'rgba(2, 2, 5, 0.85)',
                        primaryColor: '#2972f5',
                        textColor: '#ffffff',
                        zIndex: 10000,
                    },
                    tooltip: {
                        backgroundColor: '#0a0a0f',
                        borderRadius: '16px',
                        border: '1px solid rgba(41, 114, 245, 0.2)',
                        padding: '1.5rem',
                    },
                    tooltipContainer: {
                        textAlign: 'left',
                    },
                    tooltipTitle: {
                        color: '#ffffff',
                        fontWeight: '700',
                    },
                    tooltipContent: {
                        color: '#94a3b8',
                        padding: '1rem 0',
                    },
                    buttonNext: {
                        backgroundColor: '#2972f5',
                        borderRadius: '8px',
                        color: '#fff',
                        fontWeight: '600',
                        padding: '10px 20px',
                        boxShadow: '0 0 15px rgba(41, 114, 245, 0.4)'
                    },
                    buttonBack: {
                        color: '#94a3b8',
                        marginRight: '12px',
                    },
                    buttonSkip: {
                        color: '#64748b',
                    }
                }}
            />

            <section className={styles.infoMainContainer} data-tour="dashboard-info">
                <DashboardInfo />
            </section>

            <section className={styles.infoMainContainer} data-tour="recent-projects">
                <RecentProjects />
            </section>

            <button
                className={styles.tourTriggerBtn}
                onClick={handleStartTourManual}
                title={isTurkish ? "Sistem Turunu Başlat" : "Start System Tour"}
            >
                <MdHelpOutline />
                <span>{isTurkish ? "Nasıl Çalışır?" : "How it Works?"}</span>
            </button>
        </div>
    );
};

export default DashboardHome;