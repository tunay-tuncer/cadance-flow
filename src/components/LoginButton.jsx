import styles from "../styles/Login.module.css";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();

    return (
        !isAuthenticated && (

            <button className={styles.loginButton} onClick={() => loginWithRedirect()}>
                LOGIN / SIGN UP
            </button>
        )
    )
}

export default LoginButton