import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "../../styles/FlowTopBar.module.css";
import LogoutButton from "../LogoutButton";
import { Link } from "react-router";
//REACT ICONS
import { BiExit, BiHomeAlt, BiSupport } from "react-icons/bi";
import { RiUserLine, RiExpandUpDownLine } from "react-icons/ri";

const TopBar = () => {
    const { user, isAuthenticated } = useAuth0();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleUserExpand = () => {
        setIsExpanded((prev) => !prev);
    }

    const userDivComponents = [
        { id: "exit", text: "Ana Sayfa", icon: <BiHomeAlt />, path: "/" },
        { id: "support", text: "Support", icon: <BiSupport />, path: "/dashboard/support" },
        { id: "logOut", text: "Log Out", icon: <BiExit />, path: "/" }
    ]


    return (
        <div className={styles.topBarContainer}>
            <h1>CADANCE FLOW</h1>
            {isAuthenticated && <div className={styles.userDiv} onClick={() => handleUserExpand()}>

                {user?.picture ? <img className={styles.profilePic} src={user.picture} alt={user?.name} referrerPolicy="no-referrer" /> : <RiUserLine className={styles.defaultProfilePic} />}

                <button className={styles.expandButton}
                ><RiExpandUpDownLine /></button>

                {isExpanded && (
                    <div className={styles.dropdownMenu}>
                        <div className={styles.userInfoHeader}>
                            <p className={styles.userEmail}>{user?.email}</p>
                        </div>
                        <div className={styles.divider}></div>
                        {userDivComponents.map((component) => (
                            <Link to={component.path} key={component.id} className={styles.userDivComponent}>
                                {component.icon}
                                <span>{component.text}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>}
        </div>
    )
}

export default TopBar