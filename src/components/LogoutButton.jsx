//DEPENDENCIES
import { useAuth0 } from "@auth0/auth0-react";
import { ProjectContext } from "../context/ProjectContext";
import { useContext } from "react";
//STYLES
import styles from "../styles/FlowSidebar.module.css";
//REACT ICONS
import { BiExit } from "react-icons/bi";

const LogoutButton = ({ isMinimized }) => {
    const { logout, isAuthenticated } = useAuth0();
    const { currentLang } = useContext(ProjectContext);

    return (
        isAuthenticated && (
            <button
                className={styles.logOutButton}
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            >
                {!isMinimized ?
                    (<><BiExit /> {currentLang.flowPageNavbarItems.logOutButton} </>) : <BiExit />}
            </button>
        )
    )
}

export default LogoutButton