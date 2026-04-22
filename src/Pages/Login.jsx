//DEPENDENCIES
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import { ProjectContext } from "../context/ProjectContext";

//COMPONENTS
import LoginBackButton from "../components/LoginPageBackButton";
import TrackButton from "../components/TrackButton";
import LoginButton from "../components/LoginButton";
import signUpImage from "../assets/S3PNGPost.png";
import LogoutButton from "../components/LogoutButton"
import GridBackground from "../components/GridBackground";
//ASSETS
import logo from "../assets/LogoPNG.png"
//CSS
import styles from "../styles/Login.module.css";
//REACT ICONS
import { IoMdClose } from "react-icons/io";
import { RiExpandUpDownLine } from "react-icons/ri";

const Login = () => {

    const [projectTrackingNumber, setProjectTrackingNumber] = useState("");
    const [error, setError] = useState(""); // Hata mesajı için yeni state
    const { user, isAuthenticated } = useAuth0();
    const { currentLang } = useContext(ProjectContext);
    const navigate = useNavigate();

    const handleTrack = () => {
        // Hata durumlarını kontrol edelim
        if (!projectTrackingNumber) {
            setError("Lütfen bir takip kodu giriniz."); // Veya currentLang'den çekebilirsin
        } else if (projectTrackingNumber.length <= 4) {
            setError("Takip kodu en az 5 karakter olmalıdır.");

        } else if (projectTrackingNumber[0] != "C" && projectTrackingNumber[1] != "F") { setError("Lütfen geçerli bir takip kodu giriniz.") }
        else {
            setError(""); // Hata yoksa temizle
            navigate(`/track/${projectTrackingNumber}`);
        }
    };

    // Input değiştiğinde hatayı temizle (User-friendly dokunuş)
    const handleInputChange = (e) => {
        setProjectTrackingNumber(e.target.value);
        if (error) setError("");
    };

    useEffect(() => {
        const handleEnter = (e) => {
            if (e.key === 'Enter') { handleTrack() };
        };
        window.addEventListener('keydown', handleEnter);
        return () => window.removeEventListener('keydown', handleEnter);
    }, [projectTrackingNumber]); // projectTrackingNumber eklendi (Closure hatası için)

    return (
        <div className={styles.loginMainContainer}>
            <GridBackground />
            <LoginBackButton />

            <div className={styles.leftContainer}>
                <h1>CADANCE <span>FLOW</span></h1>

                <div className={`${styles.inputContainer} ${error ? styles.inputError : ""}`}>
                    <input
                        type="text"
                        placeholder={currentLang.login.placeholder}
                        className={styles.projectTrackingInput}
                        value={projectTrackingNumber}
                        onChange={handleInputChange}
                    />
                    <TrackButton code={projectTrackingNumber} handleTrack={handleTrack} />
                    <IoMdClose
                        className={styles.deleteButton}
                        onClick={() => {
                            setProjectTrackingNumber("");
                            setError("");
                        }}
                    />
                    {error && <p className={styles.errorMessage}>{error}</p>}
                </div>
                {/* Dinamik Hata Mesajı */}

                {isAuthenticated && (
                    <div className={styles.loggedInUserContainer}>

                        <div className={styles.continueDashboardContainer}>
                            <p>Continue as: </p>
                            <Link to={"/dashboard"}>{user.name}</Link>
                        </div>

                        <div className={styles.logOutContainer}>
                            <p>Change account </p>
                            <LogoutButton />
                        </div>

                    </div>
                )}

                <div className={styles.signInContainer}>
                    {!isAuthenticated && <p>{currentLang.login.signInText}</p>}
                    <div className={styles.signInButtonsContainer}>
                        <LoginButton />
                    </div>
                </div>

                <div className={styles.redirectContainer}>
                    <img className={styles.logoImg} src={logo} alt="Cadance Blue Logo" />
                    <p>Visit our <Link to={"https://www.cadancestudio.com"}>Portfolio Page</Link> for more content</p>
                </div>
            </div>

            <div className={styles.imageContainer}>
                <img src={signUpImage} alt="" />
            </div>
        </div>
    )
}

export default Login