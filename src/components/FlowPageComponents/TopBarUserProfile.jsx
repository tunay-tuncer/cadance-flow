import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "../../styles/FlowTopBar.module.css"
import LogoutButton from "../LogoutButton";
//REACT ICONS
import { RiUserLine } from "react-icons/ri";
import { RiExpandUpDownLine } from "react-icons/ri";
const TopBarUserProfile = () => {
    const { user, isAuthenticated } = useAuth0();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleUserExpand = () => {
        setIsExpanded((prev) => !prev);
    }

    return (
        isAuthenticated && (
            <div className={isExpanded ? styles.userContainerExpanded : styles.userContainer}>
                <div className={styles.userNameContainer} onClick={() => handleUserExpand()}>
                    {user?.picture ? <img className={styles.profilePic} src={user.picture} alt={user?.name} referrerPolicy="no-referrer" /> : <RiUserLine className={styles.defaultProfilePic} />}
                    {<p className={styles.userName}>{user.name}</p>}
                    {<button className={styles.expandButton}  ><RiExpandUpDownLine /></button>}
                </div>
                {isExpanded && <LogoutButton />}
            </div >
        )
    )
}

export default TopBarUserProfile