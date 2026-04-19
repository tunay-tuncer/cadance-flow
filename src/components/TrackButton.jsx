import { useContext } from "react";
import { ProjectContext } from "../context/ProjectContext";
import styles from "../styles/Login.module.css";
import { useNavigate } from "react-router"; // react-router-dom kullanıyorsan oradan çek

const TrackButton = ({ code }) => {
    const { currentLang } = useContext(ProjectContext);
    const navigate = useNavigate(); // Navigate fonksiyonunu tanımlıyoruz

    const handleTrack = () => {
        if (code && code.length > 4) {
            navigate(`/track/${code}`);
        }
    }

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