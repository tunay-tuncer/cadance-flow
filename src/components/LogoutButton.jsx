import styles from "../styles/Login.module.css";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
    const { logout, isAuthenticated } = useAuth0();

    return (
        isAuthenticated && (

            <button className={styles.loginButton} onClick={() => logout()}>
                LOG OUT
            </button>
        )
    )
}

export default LogoutButton