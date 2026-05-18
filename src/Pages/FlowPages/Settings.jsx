import { useState, useEffect } from "react";
import styles from "../../styles/Settings.module.css";
import {
    MdOutlineDarkMode,
    MdOutlineLightMode,
    MdLanguage,
    MdAccessTime,
    MdMailOutline,
    MdPersonOutline,
    MdOpenInNew,
    MdCheck,
    MdSettings
} from "react-icons/md";
import { useAuth0 } from "@auth0/auth0-react";

const Settings = () => {
    const { user } = useAuth0();
    const [isSaving, setIsSaving] = useState(false);

    // 1. Ayarları Local Storage'dan başlat (Yoksa default değerler)
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem("cadance_settings");
        return saved ? JSON.parse(saved) : {
            theme: "dark",
            language: "tr",
            emailNotifications: true,
            timezone: "Europe/Istanbul"
        };
    });

    // 2. Tema değişimini anlık olarak dokümana uygula
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", settings.theme);
    }, [settings.theme]);

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    // 3. Ayarları kaydetme fonksiyonu
    const handleSave = () => {
        setIsSaving(true);
        localStorage.setItem("cadance_settings", JSON.stringify(settings));

        // Simüle edilmiş bir bekleme (UX için)
        setTimeout(() => {
            setIsSaving(false);
            // Burada ilerde Supabase update fonksiyonunu çağıracağız
            alert(settings.language === "tr" ? "Ayarlar kaydedildi!" : "Settings saved!");
        }, 800);
    };

    return (
        <div className={styles.settingsContainer}>
            <header className={styles.settingsHeader}>
                <MdSettings className={styles.mainIcon} />
                <h1>{settings.language === "tr" ? "AYARLAR" : "SETTINGS"}</h1>
            </header>

            <div className={styles.settingsGrid}>

                {/* PROFIL SECTION */}
                <section className={styles.settingsSection}>
                    <div className={styles.sectionTitle}>
                        <MdPersonOutline />
                        <h2>{settings.language === "tr" ? "Profil Bilgileri" : "Profile Information"}</h2>
                    </div>
                    <div className={styles.profileBox}>
                        <div className={styles.avatarWrapper}>
                            <img src={user?.picture} alt="Profile" />
                        </div>
                        <div className={styles.profileInfo}>
                            <h3>{user?.name}</h3>
                            <p>{user?.email}</p>
                            <a href="#" className={styles.auth0Link}>
                                {settings.language === "tr" ? "Auth0 ile Yönet" : "Manage with Auth0"} <MdOpenInNew />
                            </a>
                        </div>
                    </div>
                </section>

                {/* APPEARANCE SECTION */}
                <section className={styles.settingsSection}>
                    <div className={styles.sectionTitle}>
                        <MdLanguage />
                        <h2>{settings.language === "tr" ? "Görünüm ve Dil" : "Appearance & Language"}</h2>
                    </div>

                    <div className={styles.settingItem}>
                        <div className={styles.settingText}>
                            <label>{settings.language === "tr" ? "Tema" : "Theme"}</label>
                            <span>{settings.language === "tr" ? "Arayüz rengini değiştirin." : "Change interface colors."}</span>
                        </div>
                        <div className={styles.themeToggleGroup}>
                            <button
                                className={settings.theme === "light" ? styles.activeTab : ""}
                                onClick={() => handleChange("theme", "light")}
                            >
                                <MdOutlineLightMode /> Light
                            </button>
                            <button
                                className={settings.theme === "dark" ? styles.activeTab : ""}
                                onClick={() => handleChange("theme", "dark")}
                            >
                                <MdOutlineDarkMode /> Dark
                            </button>
                        </div>
                    </div>

                    <div className={styles.settingItem}>
                        <div className={styles.settingText}>
                            <label>{settings.language === "tr" ? "Dil" : "Language"}</label>
                            <span>{settings.language === "tr" ? "Panel dili." : "Change dashboard language."}</span>
                        </div>
                        <select
                            value={settings.language}
                            onChange={(e) => handleChange("language", e.target.value)}
                            className={styles.selectInput}
                        >
                            <option value="tr">Türkçe (TR)</option>
                            <option value="en">English (EN)</option>
                        </select>
                    </div>

                    <div className={styles.settingItem}>
                        <div className={styles.settingText}>
                            <label>{settings.language === "tr" ? "Zaman Dilimi" : "Time Zone"}</label>
                            <span>{settings.language === "tr" ? "Tarih ve saat formatlarını belirler." : "Determines date and time formats."}</span>
                        </div>
                        <div className={styles.timezoneWrapper}>
                            <MdAccessTime className={styles.infoIcon} />
                            <select
                                value={settings.timezone}
                                onChange={(e) => handleChange("timezone", e.target.value)}
                                className={styles.selectInput}
                            >
                                <option value="Europe/Istanbul">İstanbul (GMT+3)</option>
                                <option value="Europe/London">London (GMT+0)</option>
                                <option value="America/New_York">New York (EST)</option>
                                <option value="Europe/Berlin">Berlin (GMT+1)</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* NOTIFICATIONS */}
                <section className={styles.settingsSection}>
                    <div className={styles.sectionTitle}>
                        <MdMailOutline />
                        <h2>{settings.language === "tr" ? "Bildirimler" : "Notifications"}</h2>
                    </div>
                    <div className={styles.settingItem}>
                        <div className={styles.settingText}>
                            <label>{settings.language === "tr" ? "E-posta Bildirimleri" : "Email Notifications"}</label>
                            <span>{settings.language === "tr" ? "Önemli güncellemeleri mail ile al." : "Get important updates via email."}</span>
                        </div>
                        <div
                            className={`${styles.toggleSwitch} ${settings.emailNotifications ? styles.toggleActive : ""}`}
                            onClick={() => handleToggle("emailNotifications")}
                        >
                            <div className={styles.toggleCircle}></div>
                        </div>
                    </div>
                </section>
            </div>

            <footer className={styles.settingsFooter}>
                <button
                    className={`${styles.saveButton} ${isSaving ? styles.saving : ""}`}
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? <MdCheck /> : (settings.language === "tr" ? "Değişiklikleri Kaydet" : "Save Changes")}
                </button>
            </footer>
        </div>
    );
};

export default Settings;