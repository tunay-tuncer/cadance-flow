//DEPENDENCIES
import { NavLink } from "react-router"; // or "react-router-dom"
import { useContext, useState } from "react"
import { ProjectContext } from "../../context/ProjectContext";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "../../styles/FlowNavbar.module.css"
//COMPONENTS
import LogoutButton from "../LogoutButton";
//REACT ICONS
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

import { RxDashboard } from "react-icons/rx";
import { FiArchive } from "react-icons/fi";
import { MdOutlinePermMedia } from "react-icons/md";

import { BiSupport } from "react-icons/bi";
import { LuSettings } from "react-icons/lu";
import { BiExit } from "react-icons/bi";

//ASSETS
import logo from "../../assets/LogoPNG.png"

const Navbar = () => {
    const { currentLang } = useContext(ProjectContext);
    const [isMinimized, setIsMinimized] = useState(false);

    const flowPageNavbarTopItems = [
        { name: currentLang.flowPageNavbarItems.topNavItems.dashboard, id: "dashboard", path: "./", icon: <RxDashboard /> },
        { name: currentLang.flowPageNavbarItems.topNavItems.archive, id: "archive", path: "./archive", icon: <FiArchive /> },
        { name: currentLang.flowPageNavbarItems.topNavItems.media, id: "media", path: "./media", icon: <MdOutlinePermMedia /> }
    ]

    const flowPageNavbarBottomItems = [
        { name: currentLang.flowPageNavbarItems.bottomNavItems.support, id: "dashboard", path: "./support", icon: <BiSupport /> },
        { name: currentLang.flowPageNavbarItems.bottomNavItems.settings, id: "archive", path: "./settings", icon: <LuSettings /> },
        { name: currentLang.flowPageNavbarItems.bottomNavItems.exit, id: "exit", path: "/", icon: <BiExit /> }
    ]

    const CurrentIcon = isMinimized ? MdKeyboardDoubleArrowRight : MdKeyboardDoubleArrowLeft;

    const handleMinimize = () => {
        setIsMinimized((prev) => !prev);
    };
    const { loginWithRedirect, isAuthenticated } = useAuth0();

    return (
        <nav className={isMinimized ? styles.minimizedNav : styles.fullNav}>
            <button
                type="button"
                onClick={handleMinimize}
                className={styles.minimizeBtn}
                aria-label="Toggle Sidebar"
            >
                <CurrentIcon />
            </button>
            <div className={styles.logoContainer}>
                <img src={logo} alt="cadance-logo" className={styles.logo} />
                {!isMinimized && <h1>CADANCE <span>FLOW</span></h1>}
            </div>
            <ul className={styles.navGroup}>
                {flowPageNavbarTopItems.map((navItem) => (
                    <NavLink key={navItem.id} to={navItem.path} className={({ isActive }) =>
                        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                    }>
                        {navItem.icon}
                        {!isMinimized && <p>{navItem.name}</p>}
                    </NavLink>
                ))}
            </ul>
            <ul className={styles.navGroup}>
                {flowPageNavbarBottomItems.map((navItem) => (
                    <NavLink key={navItem.id} to={navItem.path}>
                        {navItem.icon}
                        {!isMinimized && <p>{navItem.name}</p>}
                    </NavLink>
                ))}
            </ul>
            <LogoutButton />
        </nav>
    )
}

export default Navbar