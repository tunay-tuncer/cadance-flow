//DEPENDENCIES
import { useState } from "react";
import { Link } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
//COMPONENTS
import LoginBackButton from "../components/LoginBackButton";
import LoginButton from "../components/LoginButton";
import signUpImage from "../assets/S3PNGPost.png";
// import cadanceBlueLogo from "../assets/CadanceBlueGlassLogo.png";
import logo from "../assets/LogoPNG.png"
//CSS
import styles from "../styles/Login.module.css";
//REACT ICONS
import { IoMdClose } from "react-icons/io";

const Login = () => {
    const [projectTrackingNumber, setProjectTrackingNumber] = useState("");
    const { isAuthenticated } = useAuth0();

    return (
        <div className={styles.loginMainContainer}>
            <LoginBackButton />

            <div className={styles.leftContainer}>
                <h1>CADANCE <span>FLOW</span></h1>
                <div className={styles.inputContainer}>
                    <input
                        type="text"
                        placeholder="Enter your project tracking number"
                        className={styles.projectTrackingInput}
                        value={projectTrackingNumber}
                        onChange={(e) => setProjectTrackingNumber(e.target.value)}
                    />
                    <Link className={styles.trackButton}>GET YOUR FLOW</Link>
                    <IoMdClose className={styles.deleteButton} onClick={() => setProjectTrackingNumber("")} />
                </div>

                <div className={styles.signInContainer}>
                    {!isAuthenticated && <p>Sign in to access all projects!</p>}
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