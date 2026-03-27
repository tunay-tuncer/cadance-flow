import { useContext } from "react"
import { ProjectContext } from "../context/ProjectContext"
import styles from "../styles/Navbar.module.css"

import turkishTexts from "../language/tr.json";
import englishgTexts from "../language/en.json";

const LanguageButton = () => {
    const { currentLang, setcurrentLang } = useContext(ProjectContext);

    const handleLanguageChange = (e) => {
        e.preventDefault();
        setcurrentLang(prev => prev == turkishTexts ? englishgTexts : turkishTexts);
    }

    return (
        <button className={styles.languageButton} onClick={(e) => handleLanguageChange(e)}>{currentLang == turkishTexts ? "TR" : "EN"}</button>
    )
}

export default LanguageButton