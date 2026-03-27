import { Link } from "react-router"
import { useContext } from "react"
import { ProjectContext } from "../context/ProjectContext"
import styles from "../styles/Navbar.module.css"
import LanguageButton from "./LanguageButton"

const Navbar = () => {
    const { navbarItems, currentLang } = useContext(ProjectContext)

    return (
        <nav className={styles.navContainer}>
            <Link className={styles.logo} key={navbarItems[0].id} to={navbarItems[0].path}><span>CADANCE</span> FLOW</Link>

            <div className={styles.rightNavContainer}>

                {navbarItems.map((navItem) => (navItem.id != "home" &&
                    <Link key={navItem.id} to={navItem.path}>{navItem.name}</Link>
                ))}

                <LanguageButton />

            </div>

        </nav>
    )
}

export default Navbar