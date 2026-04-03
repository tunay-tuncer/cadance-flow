import { useAuth0 } from "@auth0/auth0-react";
import { RiUserLine } from "react-icons/ri";
import styles from "../styles/FlowNavbar.module.css"

const UserProfile = ({ isMinimized }) => {
    const { user, isAuthenticated } = useAuth0();

    return (
        isAuthenticated && (

            <div className={styles.userContainer}>
                {user?.picture ? <img className={styles.profilePic} src={user.picture} alt={user?.name} referrerPolicy="no-referrer" /> : <RiUserLine className={styles.defaultProfilePic} />}
                {!isMinimized && <p className={styles.userName}>{user.name}</p>}
            </div>
        )
    )
}

export default UserProfile