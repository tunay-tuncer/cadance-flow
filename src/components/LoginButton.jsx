import { useAuth0 } from "@auth0/auth0-react";
import { useContext } from "react";
import { ProjectContext } from "../context/ProjectContext"
import styles from "../styles/Login.module.css";

const LoginButton = () => {
    const { currentLang } = useContext(ProjectContext);
    const { loginWithRedirect, isAuthenticated } = useAuth0();

    return (
        !isAuthenticated && (

            <button className={styles.loginButton} onClick={() => loginWithRedirect()}>
                {currentLang.login.loginButton}
            </button>
        )
    )
}

export default LoginButton