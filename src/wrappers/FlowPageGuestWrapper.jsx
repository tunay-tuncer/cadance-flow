import { useState } from "react";
import { Link } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
//ASSETS
import logo from "../assets/LogoPNG.png";
//STYLES
import styles from "../styles/GuestNav.module.css"
//REACT ICONS
import { RiUserLine } from "react-icons/ri";
import { BsFillShieldLockFill } from "react-icons/bs";
import { IoIosInformationCircle } from "react-icons/io";


const FlowPageGuestWrapper = ({ content }) => {
    const [showInfo, setShowInfo] = useState(false);
    const { user, isAuthenticated } = useAuth0();

    return (
        <div className={styles.guestWrapper}>
            <nav className={styles.guestNav}>

                <Link to={"/"} className={styles.logoContainer}>
                    <img className={styles.logo} src={logo} alt="cadance logo" />
                    <h1>CADANCE <span>FLOW</span></h1>
                </Link>

                <div className={styles.userViewContainer}>
                    <BsFillShieldLockFill />
                    <p className={styles.userViewText}>Guest View</p>
                    <IoIosInformationCircle className={styles.infoIcon} onMouseEnter={() => setShowInfo(true)} onMouseLeave={() => setShowInfo(false)} style={{ cursor: "pointer" }} />
                    {showInfo && <div className={styles.infoTooltip}>This is a restricted version of the project overview please log in to access full view</div>}
                </div>

                {isAuthenticated ?
                    <Link to="/dashboard" className={styles.userContainer}>
                        <img src={user.picture ? user.picture : <RiUserLine />} alt="user profile" />
                        <p>{user.name}</p>
                    </Link> :
                    <Link to="/login">Login</Link>}

            </nav>
            <main>
                {content}
            </main>
        </div>
    )
}

export default FlowPageGuestWrapper