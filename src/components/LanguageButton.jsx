import { useContext } from "react";
import { ProjectContext } from "../context/ProjectContext";
import styles from "../styles/Navbar.module.css";

const LanguageButton = () => {
    const { langCode, setLangCode } = useContext(ProjectContext);

    const handleLanguageChange = (e) => {
        e.preventDefault();
        setLangCode(prev => (prev === 'tr' ? 'en' : 'tr'));
    };

    return (
        <button
            className={styles.languageButton}
            onClick={handleLanguageChange}
        >
            {langCode === 'tr' ? "TR" : "EN"}
        </button>
    );
};

export default LanguageButton;