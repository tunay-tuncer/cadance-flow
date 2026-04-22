import { useContext } from "react";
import { ProjectContext } from "../context/ProjectContext";
import styles from "../styles/Login.module.css";


const TrackButton = ({ code, handleTrack }) => {
    const { currentLang } = useContext(ProjectContext);


    return (
        <button
            type="button"
            className={styles.trackButton}
            onClick={handleTrack}
        >
            {currentLang.login.flowButton}
        </button>
    );
}

export default TrackButton;