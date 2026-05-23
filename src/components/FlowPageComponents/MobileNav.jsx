//DEPENDENCIES
import { NavLink } from "react-router"; // or "react-router-dom"
import { useContext, useState } from "react"
import { ProjectContext } from "../../context/ProjectContext";
import { useAuth0, User } from "@auth0/auth0-react";
import styles from "../../styles/FlowMobileNav.module.css"

//REACT ICONS
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

import { RxDashboard } from "react-icons/rx";
import { FiArchive } from "react-icons/fi";
import { MdOutlinePermMedia } from "react-icons/md";

import { BiSupport } from "react-icons/bi";
import { LuSettings } from "react-icons/lu";
import { BiExit } from "react-icons/bi";

const MobileNav = () => {
    const { currentLang } = useContext(ProjectContext);

    const mobileNavItems = [
        { name: currentLang.flowPageNavbarItems.topNavItems.dashboard, id: "nav-dashboard", path: "/dashboard", icon: <RxDashboard /> },
        { name: currentLang.flowPageNavbarItems.topNavItems.archive, id: "nav-archive", path: "/dashboard/archive", icon: <FiArchive /> },
        { name: currentLang.flowPageNavbarItems.topNavItems.media, id: "nav-media", path: "/dashboard/media", icon: <MdOutlinePermMedia /> },
        { name: currentLang.flowPageNavbarItems.bottomNavItems.settings, id: "nav-settings", path: "/dashboard/settings", icon: <LuSettings /> },
    ]

    return (
        <nav className={styles.mobileTabContainer}>
            <ul className={styles.navGroup}>
                {mobileNavItems.map((navItem) => (
                    <NavLink key={navItem.id} to={navItem.path} end={navItem.path === "/dashboard"} className={({ isActive }) =>
                        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                    }>
                        {navItem.icon}
                        <p>{navItem.name}</p>
                    </NavLink>
                ))}
            </ul>
        </nav>
    )
}

export default MobileNav