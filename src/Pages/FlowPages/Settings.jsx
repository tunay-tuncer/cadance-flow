import { useState } from "react";
import styles from "../../styles/Settings.module.css";
import {
    MdSettings,
    MdOutlineDarkMode,
    MdOutlineLightMode,
    MdLanguage,
    MdAccessTime,
    MdMailOutline,
    MdPersonOutline,
    MdOpenInNew
} from "react-icons/md";
import { useAuth0 } from "@auth0/auth0-react";

const Settings = () => {
    const { user } = useAuth0();

    // Ayarlar State'i (Sayfa yenilendiğinde default değerlere döner)
    const [settings, setSettings] = useState({
        theme: "dark",
        language: "tr",
        emailNotifications: true,
        timezone: "Europe/Istanbul"
    });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));

        if (key === "theme") {
            document.documentElement.setAttribute("data-theme", value);

        }
    };

    return (
        <div className={styles.settingsContainer}>
            <header className={styles.settingsHeader}>
                <MdSettings className={styles.mainIcon} />
                <h1>HESAP AYARLARI</h1>
            </header>

            <div className={styles.settingsGrid}>

                {/* PROFIL KISMI */}
                <section className={styles.settingsSection}>
                    <div className={styles.sectionTitle}>
                        <MdPersonOutline />
                        <h2>Profil Bilgileri</h2>
                    </div>
                    <div className={styles.profileBox}>
                        <div className={styles.avatarWrapper}>
                            <img src={user?.picture} alt="Profile" />
                        </div>
                        <div className={styles.profileInfo}>
                            <h3>{user?.name || "Kullanıcı"}</h3>
                            <p>{user?.email}</p>
                            <a href="https://auth0.com" target="_blank" rel="noreferrer" className={styles.auth0Link}>
                                Profilini Auth0 üzerinden yönet <MdOpenInNew />
                            </a>
                        </div>
                    </div>
                </section>

                {/* GÖRÜNÜM VE DİL */}
                <section className={styles.settingsSection}>
                    <div className={styles.sectionTitle}>
                        <MdLanguage />
                        <h2>Görünüm ve Bölge</h2>
                    </div>

                    <div className={styles.settingItem}>
                        <div className={styles.settingText}>
                            <label>Tema</label>
                            <span>Arayüzün renk modunu seçin.</span>
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
                            <label>Dil</label>
                            <span>Dashboard kullanım dili.</span>
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
                            <label>Zaman Dilimi</label>
                            <span>Tarih formatları için geçerli bölge.</span>
                        </div>
                        <div className={styles.timezoneWrapper}>
                            <MdAccessTime />
                            <select
                                value={settings.timezone}
                                onChange={(e) => handleChange("timezone", e.target.value)}
                                className={styles.selectInput}
                            >
                                <option value="Europe/Istanbul">İstanbul (GMT+3)</option>
                                <option value="Europe/London">London (GMT+0)</option>
                                <option value="America/New_York">New York (EST)</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* BİLDİRİMLER */}
                <section className={styles.settingsSection}>
                    <div className={styles.sectionTitle}>
                        <MdMailOutline />
                        <h2>Bildirimler</h2>
                    </div>
                    <div className={styles.settingItem}>
                        <div className={styles.settingText}>
                            <label>E-posta Güncellemeleri</label>
                            <span>Proje aşamaları değiştiğinde e-posta al.</span>
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
                <button className={styles.saveButton}>Değişiklikleri Kaydet</button>
            </footer>
        </div>
    );
};

export default Settings;